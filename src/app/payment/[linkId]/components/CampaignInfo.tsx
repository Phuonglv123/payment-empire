'use client';

import { Campaign } from '@/lib/types/payment.types';
import { TagIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface CampaignInfoProps {
  campaign: Campaign;
  selectedPromotion: 'km01' | 'km02' | 'km03';
  promotionAmount: number;
  isDeposit: boolean;
  depositAmount: number;
  finalAmount: number;
}

export default function CampaignInfo({ 
  campaign, 
  selectedPromotion,
  promotionAmount,
  isDeposit,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  depositAmount,
  finalAmount
}: CampaignInfoProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  const getOriginalPrice = () => {
    if (selectedPromotion === 'km01' && campaign.km01_price) {
      return campaign.original_price || 0;
    }
    if (selectedPromotion === 'km02' && campaign.km02_price) {
      return campaign.original_price || 0;
    }
    if (selectedPromotion === 'km03' && campaign.km03_price) {
      return campaign.original_price || 0;
    }
    return campaign.original_price || 0;
  };

  const originalPrice = getOriginalPrice();
  const promotionName = selectedPromotion.toUpperCase();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
      {/* Header Image/Gradient */}
      <div className="h-32 bg-gradient-to-br from-gray-900 to-gray-800 relative p-6 flex flex-col justify-end">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <TagIcon className="w-24 h-24 text-white" />
        </div>
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-[#F5A623] text-white text-xs font-bold rounded-full mb-2">
            KHÓA HỌC
          </span>
          <h2 className="text-xl font-bold text-white leading-tight">
            {campaign.name}
          </h2>
        </div>
      </div>

      <div className="p-6">
        {/* Description */}
        {campaign.description && (
          <div className="mb-6 pb-6 border-b border-gray-100">
            <p className="text-gray-600 text-sm leading-relaxed">
              {campaign.description}
            </p>
          </div>
        )}

        {/* Pricing Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Học phí gốc</span>
            <span className="text-gray-400 line-through decoration-gray-400">
              {formatCurrency(originalPrice)}
            </span>
          </div>

          {promotionAmount > 0 && (
            <div className="flex justify-between items-center text-sm bg-green-50 p-3 rounded-lg border border-green-100">
              <span className="text-green-700 font-medium flex items-center gap-1">
                <TagIcon className="w-4 h-4" />
                Chiết khấu ({promotionName})
              </span>
              <div className="text-right">
                <span className="block text-green-700 font-bold">
                  {formatCurrency(originalPrice - promotionAmount)}
                </span>
               
              </div>
            </div>
          )}

          {isDeposit && (
            <div className="flex justify-between items-center text-sm bg-orange-50 p-3 rounded-lg border border-orange-100">
              <span className="text-orange-700 font-medium">Đặt cọc trước</span>
              <span className="text-orange-700 font-bold">
                {formatCurrency(depositAmount)}
              </span>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-end">
              <span className="text-gray-600 font-medium">Tổng học phí cần thanh toán</span>
              <div className="text-right">
                <span className="block text-3xl font-bold text-[#F5A623]">
                  {formatCurrency(finalAmount)}
                </span>
                {isDeposit && (
                  <span className="text-xs text-gray-500 mt-1 block">
                    (Số tiền còn lại sẽ thanh toán sau)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
          {/* <div className="flex items-center gap-2 text-xs text-gray-500">
            <CurrencyDollarIcon className="w-4 h-4 text-[#F5A623]" />
            <span>Hoàn tiền trong 7 ngày</span>
          </div> */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <TagIcon className="w-4 h-4 text-[#F5A623]" />
            <span>Ưu đãi có hạn</span>
          </div>
        </div>
      </div>
    </div>
  );
}
