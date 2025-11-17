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
    <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
      <div className="p-6">
        {/* Campaign Name */}
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-500 mb-1">Khóa học:</div>
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
              <span className="text-green-600 font-semibold">
                -{formatCurrency(promotionAmount)}
              </span>
            </div>
          )}

          {/* Deposit Badge (if applicable) */}
          {isDeposit && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">
                  💰 Thanh toán đặt cọc
                </span>
              </div>
            </div>
          )}

          {/* Final Amount */}
          <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
            <span className="text-lg font-semibold text-gray-800">
              {isDeposit ? 'Số tiền đặt cọc:' : 'Tổng thanh toán:'}
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(finalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
