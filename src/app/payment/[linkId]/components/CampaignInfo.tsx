'use client';

import { Campaign } from '@/lib/types/payment.types';

interface CampaignInfoProps {
  campaign: Campaign;
  selectedPromotion: string;
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
  const getPromotionPrice = () => {
    switch(selectedPromotion) {
      case 'km01': return campaign.km01_price;
      case 'km02': return campaign.km02_price;
      case 'km03': return campaign.km03_price;
      default: return campaign.original_price;
    }
  };

  const calculateDiscount = (original: number, final: number) => {
    return Math.round(((original - final) / original) * 100);
  };

  const promotionPrice = getPromotionPrice();
  const totalDiscount = calculateDiscount(campaign.original_price, promotionPrice);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        {/* Campaign Name */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {campaign.name}
        </h2>

        {/* Campaign Description */}
        {campaign.description && (
          <p className="text-gray-600 mb-4 leading-relaxed">
            {campaign.description}
          </p>
        )}

        {/* Student Group */}
        {campaign.student_group && (
          <div className="mb-4">
            <span className="text-sm font-semibold text-gray-500">Nhóm học viên:</span>
            <span className="ml-2 text-gray-800">{campaign.student_group.name}</span>
          </div>
        )}

        {/* Pricing Information */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          {/* Original Price */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Giá gốc:</span>
            <span className="text-gray-400 line-through">
              {campaign.original_price.toLocaleString('vi-VN')} ₫
            </span>
          </div>

          {/* Selected Promotion */}
          {selectedPromotion && promotionAmount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Khuyến mãi ({selectedPromotion.toUpperCase()}):</span>
              <span className="text-green-600 font-semibold">
                -{promotionAmount.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          )}

          {/* Promotion Price */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Giá sau khuyến mãi:</span>
            <span className="text-gray-800 font-semibold">
              {promotionPrice.toLocaleString('vi-VN')} ₫
            </span>
          </div>

          {/* Total Discount Badge */}
          {totalDiscount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center justify-center">
                <span className="text-red-600 font-bold text-lg">
                  Tiết kiệm {totalDiscount}%
                </span>
              </div>
            </div>
          )}

          {/* Deposit Information */}
          {isDeposit && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-700 font-semibold">Đặt cọc:</span>
                <span className="text-blue-700 font-bold">
                  {depositAmount.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <p className="text-xs text-blue-600">
                * Số tiền còn lại: {(promotionPrice - depositAmount).toLocaleString('vi-VN')} ₫
              </p>
            </div>
          )}

          {/* Final Price */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-lg font-semibold text-gray-800">
              {isDeposit ? 'Số tiền cần thanh toán:' : 'Tổng thanh toán:'}
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {finalAmount.toLocaleString('vi-VN')} ₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
