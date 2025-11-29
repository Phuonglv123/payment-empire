'use client';

import { useState, useEffect } from 'react';
import { UserIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, PencilSquareIcon, TruckIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import SearchableSelect from './SearchableSelect';

export interface Province {
  code: string;
  name: string;
}

export interface District {
  code: string;
  name: string;
}

export interface Ward {
  code: string;
  name: string;
}

export interface CustomerFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  
  // Invoice Address (Level 3)
  province?: Province;
  district?: District;
  ward?: Ward;
  addressDetail: string;

  // Shipping Address (Level 3)
  isShippingSameAsBilling: boolean;
  shippingProvince?: Province;
  shippingDistrict?: District;
  shippingWard?: Ward;
  shippingAddressDetail?: string;

  notes?: string;
}

interface CustomerFormProps {
  customerInfo: CustomerFormData;
  onChange: (info: CustomerFormData) => void;
}

export default function CustomerForm({ customerInfo, onChange }: CustomerFormProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  
  const [shippingDistricts, setShippingDistricts] = useState<District[]>([]);
  const [shippingWards, setShippingWards] = useState<Ward[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  
  const [loadingShippingDistricts, setLoadingShippingDistricts] = useState(false);
  const [loadingShippingWards, setLoadingShippingWards] = useState(false);

  // Fetch Provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await axios.get('https://provinces.open-api.vn/api/?depth=1');
        if (response.data) {
          const mappedProvinces = response.data.map((p: any) => ({
            code: String(p.code),
            name: p.name
          }));
          setProvinces(mappedProvinces);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch Districts for Invoice Address
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!customerInfo.province?.code) {
        setDistricts([]);
        setWards([]);
        return;
      }
      try {
        setLoadingDistricts(true);
        const response = await axios.get(`https://provinces.open-api.vn/api/p/${customerInfo.province.code}?depth=2`);
        if (response.data && response.data.districts) {
           const mappedDistricts = response.data.districts.map((d: any) => ({
            code: String(d.code),
            name: d.name
          }));
          setDistricts(mappedDistricts);
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
      } finally {
        setLoadingDistricts(false);
      }
    };
    fetchDistricts();
  }, [customerInfo.province?.code]);

  // Fetch Wards for Invoice Address
  useEffect(() => {
    const fetchWards = async () => {
      if (!customerInfo.district?.code) {
        setWards([]);
        return;
      }
      try {
        setLoadingWards(true);
        const response = await axios.get(`https://provinces.open-api.vn/api/d/${customerInfo.district.code}?depth=2`);
        if (response.data && response.data.wards) {
           const mappedWards = response.data.wards.map((w: any) => ({
            code: String(w.code),
            name: w.name
          }));
          setWards(mappedWards);
        }
      } catch (error) {
        console.error('Error fetching wards:', error);
      } finally {
        setLoadingWards(false);
      }
    };
    fetchWards();
  }, [customerInfo.district?.code]);

  // Fetch Districts for Shipping Address
  useEffect(() => {
    const fetchShippingDistricts = async () => {
      if (!customerInfo.shippingProvince?.code) {
        setShippingDistricts([]);
        setShippingWards([]);
        return;
      }
      try {
        setLoadingShippingDistricts(true);
        const response = await axios.get(`https://provinces.open-api.vn/api/p/${customerInfo.shippingProvince.code}?depth=2`);
        if (response.data && response.data.districts) {
           const mappedDistricts = response.data.districts.map((d: any) => ({
            code: String(d.code),
            name: d.name
          }));
          setShippingDistricts(mappedDistricts);
        }
      } catch (error) {
        console.error('Error fetching shipping districts:', error);
      } finally {
        setLoadingShippingDistricts(false);
      }
    };
    fetchShippingDistricts();
  }, [customerInfo.shippingProvince?.code]);

  // Fetch Wards for Shipping Address
  useEffect(() => {
    const fetchShippingWards = async () => {
      if (!customerInfo.shippingDistrict?.code) {
        setShippingWards([]);
        return;
      }
      try {
        setLoadingShippingWards(true);
        const response = await axios.get(`https://provinces.open-api.vn/api/d/${customerInfo.shippingDistrict.code}?depth=2`);
        if (response.data && response.data.wards) {
           const mappedWards = response.data.wards.map((w: any) => ({
            code: String(w.code),
            name: w.name
          }));
          setShippingWards(mappedWards);
        }
      } catch (error) {
        console.error('Error fetching shipping wards:', error);
      } finally {
        setLoadingShippingWards(false);
      }
    };
    fetchShippingWards();
  }, [customerInfo.shippingDistrict?.code]);

  const handleChange = (field: keyof CustomerFormData, value: any) => {
    onChange({
      ...customerInfo,
      [field]: value,
    });
  };

  const handleProvinceChange = (provinceCode: string, isShipping: boolean = false) => {
    const province = provinces.find(p => p.code === provinceCode);
    
    if (isShipping) {
      onChange({
        ...customerInfo,
        shippingProvince: province,
        shippingDistrict: undefined,
        shippingWard: undefined,
      });
    } else {
      onChange({
        ...customerInfo,
        province: province,
        district: undefined,
        ward: undefined,
      });
    }
  };

  const handleDistrictChange = (districtCode: string, isShipping: boolean = false) => {
    if (isShipping) {
      const district = shippingDistricts.find(d => d.code === districtCode);
      onChange({
        ...customerInfo,
        shippingDistrict: district,
        shippingWard: undefined,
      });
    } else {
      const district = districts.find(d => d.code === districtCode);
      onChange({
        ...customerInfo,
        district: district,
        ward: undefined,
      });
    }
  };

  const handleWardChange = (wardCode: string, isShipping: boolean = false) => {
    if (isShipping) {
      const ward = shippingWards.find(w => w.code === wardCode);
      onChange({
        ...customerInfo,
        shippingWard: ward,
      });
    } else {
      const ward = wards.find(w => w.code === wardCode);
      onChange({
        ...customerInfo,
        ward: ward,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-[#F5A623]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Thông tin khách hàng
          </h3>
          <p className="text-sm text-gray-500">
            Vui lòng điền đầy đủ thông tin bên dưới
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="col-span-2 md:col-span-1">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="fullName"
              value={customerInfo.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all bg-gray-50 focus:bg-white text-black"
              placeholder="Nguyễn Văn A"
              required
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="col-span-2 md:col-span-1">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phoneNumber"
              value={customerInfo.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              className="block text-black w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              placeholder="0912 345 678"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="col-span-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              value={customerInfo.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="block text-black w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              placeholder="email@example.com"
            />
          </div>
        </div>

        {/* Invoice Address Section */}
        <div className="col-span-2 border-t border-gray-100 pt-4">
          <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-[#F5A623]" />
            Địa chỉ xuất hoá đơn
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Province */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tỉnh / Thành phố <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={provinces}
                value={customerInfo.province?.code}
                onChange={(val) => handleProvinceChange(val, false)}
                placeholder="Chọn Tỉnh / Thành phố"
                loading={loadingProvinces}
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quận / Huyện <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={districts}
                value={customerInfo.district?.code}
                onChange={(val) => handleDistrictChange(val, false)}
                placeholder={loadingDistricts ? "Đang tải..." : "Chọn Quận / Huyện"}
                disabled={!customerInfo.province || loadingDistricts}
                loading={loadingDistricts}
              />
            </div>

            {/* Ward */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phường / Xã <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={wards}
                value={customerInfo.ward?.code}
                onChange={(val) => handleWardChange(val, false)}
                placeholder={loadingWards ? "Đang tải..." : "Chọn Phường / Xã"}
                disabled={!customerInfo.district || loadingWards}
                loading={loadingWards}
              />
            </div>

            {/* Detail Address */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ chi tiết <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerInfo.addressDetail}
                onChange={(e) => handleChange("addressDetail", e.target.value)}
                className="block text-black w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F5A623] focus:border-transparent bg-gray-50 focus:bg-white"
                placeholder="Số nhà, tên đường..."
              />
            </div>
          </div>
        </div>

        {/* Shipping Address Option */}
        <div className="col-span-2 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="sameAddress"
              checked={customerInfo.isShippingSameAsBilling}
              onChange={(e) =>
                handleChange("isShippingSameAsBilling", e.target.checked)
              }
              className="w-4 h-4  text-[#F5A623] border-gray-300 rounded focus:ring-[#F5A623]"
            />
            <label
              htmlFor="sameAddress"
              className="text-sm font-medium text-gray-700 select-none cursor-pointer"
            >
              Địa chỉ nhận sách giống địa chỉ xuất hoá đơn
            </label>
          </div>

          {!customerInfo.isShippingSameAsBilling && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-fadeIn">
              <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TruckIcon className="w-5 h-5 text-[#F5A623]" />
                Địa chỉ nhận sách
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Shipping Province */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tỉnh / Thành phố
                  </label>
                  <SearchableSelect
                    options={provinces}
                    value={customerInfo.shippingProvince?.code}
                    onChange={(val) => handleProvinceChange(val, true)}
                    placeholder="Chọn Tỉnh / Thành phố"
                    className="bg-white"
                  />
                </div>

                {/* Shipping District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quận / Huyện
                  </label>
                  <SearchableSelect
                    options={shippingDistricts}
                    value={customerInfo.shippingDistrict?.code}
                    onChange={(val) => handleDistrictChange(val, true)}
                    placeholder={loadingShippingDistricts ? "Đang tải..." : "Chọn Quận / Huyện"}
                    disabled={!customerInfo.shippingProvince || loadingShippingDistricts}
                    loading={loadingShippingDistricts}
                    className="bg-white"
                  />
                </div>

                {/* Shipping Ward */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phường / Xã
                  </label>
                  <SearchableSelect
                    options={shippingWards}
                    value={customerInfo.shippingWard?.code}
                    onChange={(val) => handleWardChange(val, true)}
                    placeholder={loadingShippingWards ? "Đang tải..." : "Chọn Phường / Xã"}
                    disabled={!customerInfo.shippingDistrict || loadingShippingWards}
                    loading={loadingShippingWards}
                    className="bg-white"
                  />
                </div>

                {/* Shipping Detail Address */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ chi tiết
                  </label>
                  <input
                    type="text"
                    value={customerInfo.shippingAddressDetail || ""}
                    onChange={(e) =>
                      handleChange("shippingAddressDetail", e.target.value)
                    }
                    className="block text-black w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F5A623] focus:border-transparent bg-white"
                    placeholder="Số nhà, tên đường..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="col-span-2">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Ghi chú thêm
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <PencilSquareIcon className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="notes"
              value={customerInfo.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
              className="block text-black w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all bg-gray-50 focus:bg-white resize-none"
              placeholder="Nhập ghi chú nếu có..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
