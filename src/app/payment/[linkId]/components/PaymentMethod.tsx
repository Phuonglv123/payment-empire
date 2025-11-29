'use client';

import { CreditCardIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

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
    <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <CreditCardIcon className="w-6 h-6 text-[#F5A623]" />
        Phương thức thanh toán
      </h3>

      <div className="relative overflow-hidden rounded-xl border-2 border-[#F5A623] bg-orange-50/50 p-4 transition-all hover:shadow-md cursor-pointer">
        <div className="flex items-center gap-4">
          {/* Bank Icon */}
          <div className="w-12 h-12 bg-linear-to-br from-[#F5A623] to-[#FF8C00] rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
            <CreditCardIcon className="w-6 h-6 text-white" />
          </div>

          {/* Bank Info */}
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-lg">Chuyển khoản ngân hàng</p>
            <p className="text-sm text-gray-600 font-medium">{bankName}</p>
          </div>

          {/* Selected Badge */}
          <CheckCircleIcon className="w-8 h-8 text-[#F5A623]" />
        </div>
        
        {/* Decorative background element */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#F5A623]/10 rounded-full blur-2xl"></div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <InformationCircleIcon className="w-6 h-6 text-blue-500 shrink-0" />
        <p className="text-sm text-blue-800 font-medium leading-relaxed">
          Sau khi nhấn <span className="font-bold">"Thanh toán"</span>, hệ thống sẽ tạo mã QR. Bạn chỉ cần mở ứng dụng ngân hàng và quét mã để hoàn tất giao dịch.
        </p>
      </div>
    </div>
  );
}
