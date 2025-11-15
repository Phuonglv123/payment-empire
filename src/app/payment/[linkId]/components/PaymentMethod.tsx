'use client';

interface PaymentMethodProps {
  bankCode: string;
}

const BANK_NAMES: Record<string, string> = {
  MSB: 'Ngân hàng TMCP Hàng Hải Việt Nam (MSB)',
  VCB: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
  TCB: 'Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)',
  ACB: 'Ngân hàng TMCP Á Châu (ACB)',
  VPB: 'Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)',
  MB: 'Ngân hàng TMCP Quân Đội (MB)',
  BIDV: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)',
  VIB: 'Ngân hàng TMCP Quốc tế Việt Nam (VIB)',
};

export default function PaymentMethod({ bankCode }: PaymentMethodProps) {
  const bankName = BANK_NAMES[bankCode] || bankCode;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-5">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">
          Phương thức thanh toán
        </h3>
      </div>

      <div className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          {/* Bank Icon */}
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>

          {/* Bank Info */}
          <div className="flex-1">
            <p className="font-bold text-gray-800 text-lg">Chuyển khoản ngân hàng</p>
            <p className="text-sm text-gray-600 mt-1">{bankName}</p>
          </div>

          {/* Selected Badge */}
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-5 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
        <div className="flex">
          <svg
            className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">
              Hướng dẫn thanh toán
            </p>
            <p className="text-sm text-blue-800">
              Sau khi nhấn <span className="font-semibold">&quot;Thanh toán&quot;</span>, bạn sẽ nhận được mã QR để quét và thực hiện thanh toán qua ứng dụng ngân hàng.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Features */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>An toàn & bảo mật</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Nhanh chóng</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Tiện lợi 24/7</span>
        </div>
      </div>
    </div>
  );
}
