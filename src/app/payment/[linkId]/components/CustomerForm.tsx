'use client';

import { useState, useEffect } from 'react';
import { UserIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, PencilSquareIcon, TruckIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import SearchableSelect from './SearchableSelect';

const REFERRAL_SOURCES = [
  "Fanpage Empire Team- Luyện Thi Đánh Giá Năng Lực",
  "Fanpage Luyện thi ĐGNL - Empire Team",
  "Fanpage Empire Team-Luyện Thi ĐGNL Hà Nội",
  "Website Empire",
  "Tiktok Empire",
  "Bạn bè giới thiệu qua tư vấn viên",
  "CTV",
  "Khác (có thể điền cụ thể)"
];

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
  secondPhoneNumber?: string;
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
  // Invoice Address State (2 levels)
  const [invoiceProvinces, setInvoiceProvinces] = useState<Province[]>([]);
  const [invoiceWards, setInvoiceWards] = useState<Ward[]>([]);
  
  // Shipping Address State (3 levels)
  const [shippingProvinces, setShippingProvinces] = useState<Province[]>([]);
  const [shippingDistricts, setShippingDistricts] = useState<District[]>([]);
  const [shippingWards, setShippingWards] = useState<Ward[]>([]);

  const [loadingInvoiceProvinces, setLoadingInvoiceProvinces] = useState(false);
  const [loadingInvoiceWards, setLoadingInvoiceWards] = useState(false);
  
  const [loadingShippingProvinces, setLoadingShippingProvinces] = useState(false);
  const [loadingShippingDistricts, setLoadingShippingDistricts] = useState(false);
  const [loadingShippingWards, setLoadingShippingWards] = useState(false);

  // Fetch Invoice Provinces (Old API)
  useEffect(() => {
    const fetchInvoiceProvinces = async () => {
      try {
        setLoadingInvoiceProvinces(true);
        const response = await axios.get('https://api-geo-three.vercel.app/api/provinces');
        if (response.data && response.data.data) {
          setInvoiceProvinces(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching invoice provinces:', error);
      } finally {
        setLoadingInvoiceProvinces(false);
      }
    };
    fetchInvoiceProvinces();
  }, []);

  // Fetch Shipping Provinces (New API)
  useEffect(() => {
    const fetchShippingProvinces = async () => {
      try {
        setLoadingShippingProvinces(true);
        const response = await axios.get('https://provinces.open-api.vn/api/?depth=1');
        if (response.data) {
          const mappedProvinces = response.data.map((p: any) => ({
            code: String(p.code),
            name: p.name
          }));
          setShippingProvinces(mappedProvinces);
        }
      } catch (error) {
        console.error('Error fetching shipping provinces:', error);
      } finally {
        setLoadingShippingProvinces(false);
      }
    };
    fetchShippingProvinces();
  }, []);

  // Fetch Invoice Wards (Old API)
  useEffect(() => {
    const fetchInvoiceWards = async () => {
      if (!customerInfo.province?.code) {
        setInvoiceWards([]);
        return;
      }
      try {
        setLoadingInvoiceWards(true);
        const response = await axios.get(`https://api-geo-three.vercel.app/api/provinces/${customerInfo.province.code}`);
        if (response.data && response.data.data && response.data.data.wards) {
          setInvoiceWards(response.data.data.wards);
        }
      } catch (error) {
        console.error('Error fetching invoice wards:', error);
      } finally {
        setLoadingInvoiceWards(false);
      }
    };
    fetchInvoiceWards();
  }, [customerInfo.province?.code]);

  // Fetch Shipping Districts (New API)
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

  // Fetch Shipping Wards (New API)
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

  const handleInvoiceProvinceChange = (provinceCode: string) => {
    const province = invoiceProvinces.find(p => p.code === provinceCode);
    onChange({
      ...customerInfo,
      province: province,
      ward: undefined, // Reset ward
    });
  };

  const handleInvoiceWardChange = (wardCode: string) => {
    const ward = invoiceWards.find(w => w.code === wardCode);
    onChange({
      ...customerInfo,
      ward: ward,
    });
  };

  const handleShippingProvinceChange = (provinceCode: string) => {
    const province = shippingProvinces.find(p => p.code === provinceCode);
    onChange({
      ...customerInfo,
      shippingProvince: province,
      shippingDistrict: undefined,
      shippingWard: undefined,
    });
  };

  const handleShippingDistrictChange = (districtCode: string) => {
    const district = shippingDistricts.find(d => d.code === districtCode);
    onChange({
      ...customerInfo,
      shippingDistrict: district,
      shippingWard: undefined,
    });
  };

  const handleShippingWardChange = (wardCode: string) => {
    const ward = shippingWards.find(w => w.code === wardCode);
    onChange({
      ...customerInfo,
      shippingWard: ward,
    });
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

        {/* Second Phone Number */}
        <div className="col-span-2 md:col-span-1">
          <label
            htmlFor="secondPhoneNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Số điện thoại 2 (Tùy chọn)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="secondPhoneNumber"
              value={customerInfo.secondPhoneNumber || ""}
              onChange={(e) => handleChange("secondPhoneNumber", e.target.value)}
              className="block text-black w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              placeholder="0912 345 678"
            />
          </div>
        </div>

        {/* Email */}
        <div className="col-span-2 md:col-span-1">
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

        {/* Invoice Address Section (2 Levels) */}
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
                options={invoiceProvinces}
                value={customerInfo.province?.code}
                onChange={handleInvoiceProvinceChange}
                placeholder="Chọn Tỉnh / Thành phố"
                loading={loadingInvoiceProvinces}
              />
            </div>

            {/* Ward */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phường / Xã <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={invoiceWards}
                value={customerInfo.ward?.code}
                onChange={handleInvoiceWardChange}
                placeholder={loadingInvoiceWards ? "Đang tải..." : "Chọn Phường / Xã"}
                disabled={!customerInfo.province || loadingInvoiceWards}
                loading={loadingInvoiceWards}
              />
            </div>

            {/* Detail Address */}
            <div className="col-span-2">
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

        {/* Shipping Address Section (3 Levels) - Always Visible */}
        <div className="col-span-2 border-t border-gray-100 pt-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-fadeIn">
            <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TruckIcon className="w-5 h-5 text-[#F5A623]" />
              Địa chỉ nhận sách
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shipping Province */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tỉnh / Thành phố <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={shippingProvinces}
                  value={customerInfo.shippingProvince?.code}
                  onChange={handleShippingProvinceChange}
                  placeholder="Chọn Tỉnh / Thành phố"
                  loading={loadingShippingProvinces}
                  className="bg-white"
                />
              </div>

              {/* Shipping District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quận / Huyện <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={shippingDistricts}
                  value={customerInfo.shippingDistrict?.code}
                  onChange={handleShippingDistrictChange}
                  placeholder={loadingShippingDistricts ? "Đang tải..." : "Chọn Quận / Huyện"}
                  disabled={!customerInfo.shippingProvince || loadingShippingDistricts}
                  loading={loadingShippingDistricts}
                  className="bg-white"
                />
              </div>

              {/* Shipping Ward */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phường / Xã <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={shippingWards}
                  value={customerInfo.shippingWard?.code}
                  onChange={handleShippingWardChange}
                  placeholder={loadingShippingWards ? "Đang tải..." : "Chọn Phường / Xã"}
                  disabled={!customerInfo.shippingDistrict || loadingShippingWards}
                  loading={loadingShippingWards}
                  className="bg-white"
                />
              </div>

              {/* Shipping Detail Address */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ chi tiết <span className="text-red-500">*</span>
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
        </div>

        {/* Referral Source */}
        <div className="col-span-2">
          <label
            htmlFor="referralSource"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Bạn biết đến Empire qua đâu?
          </label>
          <div className="space-y-3">
            <div className="relative">
              <select
                id="referralSource"
                value={
                  REFERRAL_SOURCES.includes(customerInfo.notes || "")
                    ? customerInfo.notes
                    : customerInfo.notes?.startsWith("Khác: ")
                    ? "Khác (có thể điền cụ thể)"
                    : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "Khác (có thể điền cụ thể)") {
                    handleChange("notes", "Khác: ");
                  } else {
                    handleChange("notes", value);
                  }
                }}
                className="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all bg-gray-50 focus:bg-white text-black appearance-none"
              >
                <option value="" disabled>
                  -- Chọn nguồn --
                </option>
                {REFERRAL_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {customerInfo.notes?.startsWith("Khác: ") && (
              <input
                type="text"
                value={customerInfo.notes.substring(6)}
                onChange={(e) => handleChange("notes", `Khác: ${e.target.value}`)}
                className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all bg-white text-black"
                placeholder="Nhập cụ thể..."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
