'use client';

import { CustomerInfo } from '@/lib/types/payment.types';

interface CustomerFormProps {
  customerInfo: CustomerInfo;
  onChange: (info: CustomerInfo) => void;
}

export default function CustomerForm({ customerInfo, onChange }: CustomerFormProps) {
  const handleChange = (field: keyof CustomerInfo, value: string) => {
    onChange({
      ...customerInfo,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Thông tin khách hàng
      </h3>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            value={customerInfo.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Nhập họ và tên của bạn"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={customerInfo.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="0912345678"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={customerInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="example@email.com"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            value={customerInfo.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
            placeholder="Nhập địa chỉ của bạn"
            required
          />
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        <span className="text-red-500">*</span> Thông tin bắt buộc
      </p>
    </div>
  );
}
