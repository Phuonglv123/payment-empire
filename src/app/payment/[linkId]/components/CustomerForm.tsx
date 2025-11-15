'use client';

import { CustomerInfo } from '@/lib/types/payment.types';
import { useState } from 'react';

interface CustomerFormProps {
  customerInfo: CustomerInfo;
  onChange: (info: CustomerInfo) => void;
}

export default function CustomerForm({ customerInfo, onChange }: CustomerFormProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    onChange({
      ...customerInfo,
      [field]: value,
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleBlur = (field: keyof CustomerInfo) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, customerInfo[field]);
  };

  const validateField = (field: keyof CustomerInfo, value: string) => {
    let error = '';
    
    if (!value.trim()) {
      error = 'Trường này là bắt buộc';
    } else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Email không hợp lệ';
    } else if (field === 'phoneNumber' && !/^[0-9]{10,11}$/.test(value.replace(/\s/g, ''))) {
      error = 'Số điện thoại phải có 10-11 chữ số';
    }
    
    setErrors({ ...errors, [field]: error });
    return !error;
  };

  const getInputClassName = (field: keyof CustomerInfo) => {
    const baseClass = "w-full px-4 py-3 border rounded-lg outline-none transition-all";
    const hasError = touched[field] && errors[field];
    const hasValue = customerInfo[field].trim().length > 0;
    
    if (hasError) {
      return `${baseClass} border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50`;
    } else if (hasValue && touched[field]) {
      return `${baseClass} border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50`;
    }
    return `${baseClass} border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-5">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">
          Thông tin khách hàng
        </h3>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="fullName"
              value={customerInfo.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
              className={getInputClassName('fullName')}
              placeholder="Nguyễn Văn A"
              required
            />
            {touched.fullName && !errors.fullName && customerInfo.fullName && (
              <div className="absolute right-3 top-3.5 text-green-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {touched.fullName && errors.fullName && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phoneNumber"
              value={customerInfo.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              onBlur={() => handleBlur('phoneNumber')}
              className={getInputClassName('phoneNumber')}
              placeholder="0912345678"
              required
            />
            {touched.phoneNumber && !errors.phoneNumber && customerInfo.phoneNumber && (
              <div className="absolute right-3 top-3.5 text-green-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {touched.phoneNumber && errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.phoneNumber}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={customerInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={getInputClassName('email')}
              placeholder="example@email.com"
              required
            />
            {touched.email && !errors.email && customerInfo.email && (
              <div className="absolute right-3 top-3.5 text-green-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {touched.email && errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea
              id="address"
              value={customerInfo.address}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              rows={3}
              className={getInputClassName('address') + ' resize-none'}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              required
            />
            {touched.address && !errors.address && customerInfo.address && (
              <div className="absolute right-3 top-3 text-green-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {touched.address && errors.address && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.address}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-red-500">*</span> Thông tin bắt buộc - Vui lòng điền đầy đủ để tiếp tục
        </p>
      </div>
    </div>
  );
}
