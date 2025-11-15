'use client';

import Image from 'next/image';

interface QRCodeDisplayProps {
  qrCodeUrl: string;
  amount: number;
  isCheckingPayment: boolean;
}

export default function QRCodeDisplay({ qrCodeUrl, amount, isCheckingPayment }: QRCodeDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Quét mã QR để thanh toán
      </h3>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        <div className="relative w-64 h-64 border-4 border-gray-200 rounded-lg overflow-hidden">
          <Image
            src={qrCodeUrl}
            alt="QR Code"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Amount */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 mb-1">Số tiền cần thanh toán</p>
        <p className="text-3xl font-bold text-blue-600">
          {amount.toLocaleString('vi-VN')} ₫
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-blue-900 mb-2">Hướng dẫn thanh toán:</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
          <li>Mở ứng dụng ngân hàng trên điện thoại của bạn</li>
          <li>Chọn tính năng &quot;Quét mã QR&quot; hoặc &quot;Chuyển khoản&quot;</li>
          <li>Quét mã QR hiển thị ở trên</li>
          <li>Xác nhận thông tin và hoàn tất giao dịch</li>
        </ol>
      </div>

      {/* Payment Status */}
      <div className="text-center">
        {isCheckingPayment ? (
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Đang kiểm tra thanh toán...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2 text-yellow-600">
            <svg className="animate-pulse h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>Đang chờ thanh toán...</span>
          </div>
        )}
      </div>

      {/* Note */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Hệ thống sẽ tự động xác nhận khi bạn hoàn tất thanh toán
        </p>
      </div>
    </div>
  );
}
