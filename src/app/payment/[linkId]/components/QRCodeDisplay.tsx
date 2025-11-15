'use client';

import Image from 'next/image';

interface QRCodeDisplayProps {
  qrCodeUrl: string;
  amount: number;
  isCheckingPayment: boolean;
}

export default function QRCodeDisplay({ qrCodeUrl, amount, isCheckingPayment }: QRCodeDisplayProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
      <div className="text-center mb-6">
        <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Quét mã QR để thanh toán
        </h3>
        <p className="text-gray-600">
          Sử dụng ứng dụng ngân hàng để quét mã bên dưới
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
          <div className="relative w-72 h-72 border-8 border-white rounded-2xl overflow-hidden shadow-2xl bg-white">
            <Image
              src={qrCodeUrl}
              alt="QR Code"
              fill
              className="object-contain p-4"
              priority
            />
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="text-center mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
        <p className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">Số tiền cần thanh toán</p>
        <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          {amount.toLocaleString('vi-VN')} ₫
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex items-start mb-3">
          <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <h4 className="font-bold text-blue-900 text-lg">Hướng dẫn thanh toán</h4>
        </div>
        <ol className="space-y-3 text-sm text-blue-900">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 font-bold text-xs">1</span>
            <span className="pt-0.5">Mở ứng dụng ngân hàng trên điện thoại của bạn</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 font-bold text-xs">2</span>
            <span className="pt-0.5">Chọn tính năng <span className="font-semibold">&quot;Quét mã QR&quot;</span> hoặc <span className="font-semibold">&quot;Chuyển khoản&quot;</span></span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 font-bold text-xs">3</span>
            <span className="pt-0.5">Quét mã QR hiển thị ở trên</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 font-bold text-xs">4</span>
            <span className="pt-0.5">Xác nhận thông tin và hoàn tất giao dịch</span>
          </li>
        </ol>
      </div>

      {/* Payment Status */}
      <div className="text-center bg-gray-50 rounded-xl p-5 border border-gray-200">
        {isCheckingPayment ? (
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800">Đang kiểm tra thanh toán...</p>
              <p className="text-sm text-gray-600">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <svg className="animate-pulse h-8 w-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-yellow-400 animate-ping"></span>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800">Đang chờ thanh toán...</p>
              <p className="text-sm text-gray-600">Vui lòng quét mã QR để thanh toán</p>
            </div>
          </div>
        )}
      </div>

      {/* Note */}
      <div className="mt-5 text-center bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-center mb-1">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-semibold text-green-800">
            Tự động xác nhận
          </p>
        </div>
        <p className="text-xs text-green-700">
          Hệ thống sẽ tự động xác nhận và thông báo khi bạn hoàn tất thanh toán
        </p>
      </div>
    </div>
  );
}
