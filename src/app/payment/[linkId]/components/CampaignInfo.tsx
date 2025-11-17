'use client';

import { Campaign } from '@/lib/types/payment.types';

interface CampaignInfoProps {
  campaign: Campaign;
  productName: string;
  basePrice: number;
  discountPercent: number;
  finalPrice: number;
  notes?: string;
}

export default function CampaignInfo({ 
  campaign, 
  productName,
  basePrice,
  discountPercent,
  finalPrice,
  notes
}: CampaignInfoProps) {
  const discountAmount = basePrice - finalPrice;
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

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

        {/* Product Name */}
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-500 mb-1">Sản phẩm:</div>
          <div className="text-gray-800">{productName}</div>
        </div>

        {/* Pricing Information */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          {/* Base Price */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Giá gốc:</span>
            <span className="text-gray-400 line-through">
              {formatCurrency(basePrice)}
            </span>
          </div>

          {/* Discount */}
          {discountPercent > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Giảm giá ({discountPercent}%):</span>
              <span className="text-green-600 font-semibold">
                -{formatCurrency(discountAmount)}
              </span>
            </div>
          )}

          {/* Total Discount Badge */}
          {discountPercent > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center justify-center">
                <span className="text-red-600 font-bold text-lg">
                  🎉 Tiết kiệm {discountPercent}%
                </span>
              </div>
            </div>
          )}

          {/* Final Price */}
          <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
            <span className="text-lg font-semibold text-gray-800">
              Tổng thanh toán:
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(finalPrice)}
            </span>
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm font-semibold text-blue-700 mb-1">💡 Ghi chú:</div>
              <p className="text-sm text-blue-600">{notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
