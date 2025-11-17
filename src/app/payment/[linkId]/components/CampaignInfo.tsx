'use client';

import { Campaign } from '@/lib/types/payment.types';

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

  // Lấy giá gốc dựa trên khuyến mãi được chọn
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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-4 border border-gray-100">
      <div className="bg-gradient-to-r from-[#F5A623] to-[#FF8C00] p-4">
        <h3 className="text-white font-bold text-lg flex items-center">
          <span className="mr-2">👑</span>
          <span>THÔNG TIN KHÓA HỌC</span>
        </h3>
      </div>
      <div className="p-6">
        {/* Campaign Name */}
        <div className="mb-4">
          <div className="text-sm font-semibold text-[#F5A623] mb-1">Khóa học:</div>
          <h2 className="text-2xl font-bold text-gray-800">
            📚 {campaign.name}
          </h2>
        </div>

        {/* Campaign Description */}
        {campaign.description && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <p className="text-gray-600 text-sm leading-relaxed">
              {campaign.description}
            </p>
          </div>
        )}

        {/* Pricing Information */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          {/* Original Price */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Giá gốc:</span>
            <span className="text-gray-400 line-through">
              {formatCurrency(originalPrice)}
            </span>
          </div>

          {/* Promotion */}
          {promotionAmount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Khuyến mãi ({promotionName}):</span>
              <span className="text-[#F5A623] font-bold">
                -{formatCurrency(promotionAmount)}
              </span>
            </div>
          )}

          {/* Deposit Badge (if applicable) */}
          {isDeposit && (
            <div className="bg-gradient-to-r from-[#FFF8E8] to-[#FFE8B8] border border-[#F5A623] rounded-lg p-3">
              <div className="flex items-center justify-center">
                <span className="text-[#F5A623] font-bold text-sm">
                  💰 Thanh toán đặt cọc
                </span>
              </div>
            </div>
          )}

          {/* Final Amount */}
          <div className="flex justify-between items-center pt-3 border-t-2 border-[#F5A623]">
            <span className="text-lg font-semibold text-gray-800">
              {isDeposit ? 'Số tiền đặt cọc:' : 'Tổng thanh toán:'}
            </span>
            <span className="text-2xl font-bold text-[#F5A623]">
              {formatCurrency(finalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
