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
  const promotionName = () => {
    switch (selectedPromotion) {
      case "km01":
        return "Giá cá nhân";
      case "km02":
        return "Giá nhóm 5";
      case "km03":
        return "Giá nhóm 10";
        break;
    
      default:
        break;
    }
  };

  // Check if campaign has reached maximum quantity
  const isCampaignExpired = campaign.used_quantity !== undefined && 
                            campaign.max_quantity !== undefined && 
                            campaign.used_quantity >= campaign.max_quantity;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
      {/* Header Image/Gradient */}
      <div className="h-32 bg-linear-to-br from-gray-900 to-gray-800 relative p-6 flex flex-col justify-end">
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
        {/* Expired Campaign Banner */}
        {isCampaignExpired && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold text-center flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              Chương trình đã hết hạn
            </p>
            {campaign.max_quantity && (
              <p className="text-red-600 text-xs text-center mt-1">
                Đã đạt số lượng tối đa: {campaign.max_quantity}
              </p>
            )}
          </div>
        )}

        {/* Description */}
        {/* {campaign.description && (
          <div className="mb-6 pb-6 border-b border-gray-100">
            <p className="text-gray-600 text-sm leading-relaxed">
              {campaign.description}
            </p>
          </div>
        )} */}

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
                Chiết khấu ({promotionName()})
              </span>
              <div className="text-right">
                <span className="block text-green-700 font-bold">
                  {formatCurrency(promotionAmount)}
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

        {/* Quantity Information */}
        {campaign.max_quantity !== undefined && campaign.used_quantity !== undefined && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-600 font-medium">Số lượng còn lại</span>
              <span className={`font-bold ${isCampaignExpired ? 'text-red-600' : 'text-[#F5A623]'}`}>
                {campaign.max_quantity - campaign.used_quantity}/{campaign.max_quantity}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full transition-all ${isCampaignExpired ? 'bg-red-500' : 'bg-[#F5A623]'}`}
                style={{ width: `${Math.min((campaign.used_quantity / campaign.max_quantity) * 100, 100)}%` }}
              />
            </div>
            {!isCampaignExpired && campaign.max_quantity - campaign.used_quantity <= 5 && (
              <p className="text-xs text-orange-600 mt-2 text-center font-medium">
                ⚠️ Chỉ còn {campaign.max_quantity - campaign.used_quantity} suất!
              </p>
            )}
          </div>
        )}

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
