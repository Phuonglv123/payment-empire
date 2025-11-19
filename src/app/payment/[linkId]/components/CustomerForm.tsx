'use client';

interface CustomerFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  notes?: string;
}

interface CustomerFormProps {
  customerInfo: CustomerFormData;
  onChange: (info: CustomerFormData) => void;
}

export default function CustomerForm({ customerInfo, onChange }: CustomerFormProps) {
  const handleChange = (field: keyof CustomerFormData, value: string) => {
    onChange({
      ...customerInfo,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="text-[#F5A623] mr-2">👤</span>
        <span>Thông tin của bạn</span>
      </h3>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            value={customerInfo.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-[#F5A623] outline-none transition-all"
            placeholder="Nhập họ và tên đầy đủ"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={customerInfo.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-[#F5A623] outline-none transition-all"
            placeholder="0912345678"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={customerInfo.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-[#F5A623] outline-none transition-all"
            placeholder="email@example.com"
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Địa chỉ
          </label>
          <input
            type="text"
            id="address"
            value={customerInfo.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-[#F5A623] outline-none transition-all"
            placeholder="123 Nguyễn Huệ, Q1, TPHCM"
          />
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nhóm học/Ghi chú
          </label>
          <textarea
            id="notes"
            value={customerInfo.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={3}
            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-[#F5A623] outline-none transition-all resize-none"
            placeholder="VD: Muốn học buổi tối, đã có kinh nghiệm HTML/CSS..."
          />
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        <span className="text-red-500">*</span> Thông tin bắt buộc
      </p>
    </div>
  );
}
