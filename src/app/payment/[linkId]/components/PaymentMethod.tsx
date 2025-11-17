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
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="text-[#F5A623] mr-2">💳</span>
        <span>Phương thức thanh toán</span>
      </h3>

      <div className="border-2 border-[#F5A623] rounded-lg p-4 bg-gradient-to-br from-[#FFF8E8] to-white">
        <div className="flex items-center space-x-3">
          {/* Bank Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-[#F5A623] to-[#FF8C00] rounded-lg flex items-center justify-center shadow-md">
            <svg
              className="w-6 h-6 text-white"
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
            <p className="font-bold text-gray-800">Chuyển khoản ngân hàng</p>
            <p className="text-sm text-gray-600">{bankName}</p>
          </div>

          {/* Selected Badge */}
          <div className="w-6 h-6 bg-[#F5A623] rounded-full flex items-center justify-center shadow-md">
            <svg
              className="w-4 h-4 text-white"
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

      <div className="mt-4 bg-gradient-to-r from-[#FFF8E8] to-[#FFE8B8] border border-[#F5A623] rounded-lg p-4">
        <div className="flex">
          <svg
            className="w-5 h-5 text-[#F5A623] mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-gray-800 font-medium">
            Sau khi nhấn &quot;Thanh toán&quot;, bạn sẽ nhận được mã QR để quét và thực hiện thanh toán qua ứng dụng ngân hàng.
          </p>
        </div>
      </div>
    </div>
  );
}
