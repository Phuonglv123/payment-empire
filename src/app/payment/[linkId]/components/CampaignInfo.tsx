'use client';

import { Campaign } from '@/lib/types/payment.types';
import Image from 'next/image';

interface CampaignInfoProps {
  campaign: Campaign;
}

export default function CampaignInfo({ campaign }: CampaignInfoProps) {
  const calculateDiscount = (original: number, final: number) => {
    return Math.round(((original - final) / original) * 100);
  };

  const totalDiscount = calculateDiscount(campaign.originalPrice, campaign.finalPrice);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Campaign Image */}
      {campaign.imageUrl && (
        <div className="relative w-full h-64 bg-gray-200">
          <Image
            src={campaign.imageUrl}
            alt={campaign.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

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

        {/* Product Name */}
        {campaign.product && (
          <div className="mb-4">
            <span className="text-sm font-semibold text-gray-500">Sản phẩm:</span>
            <span className="ml-2 text-gray-800">{campaign.product}</span>
          </div>
        )}

        {/* Pricing Information */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          {/* Original Price */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Giá gốc:</span>
            <span className="text-gray-400 line-through">
              {campaign.originalPrice.toLocaleString('vi-VN')} ₫
            </span>
          </div>

          {/* Discounts */}
          {campaign.discount1 !== undefined && campaign.discount1 > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Khuyến mãi 1:</span>
              <span className="text-green-600 font-semibold">
                -{campaign.discount1}%
              </span>
            </div>
          )}

          {campaign.discount2 !== undefined && campaign.discount2 > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Khuyến mãi 2:</span>
              <span className="text-green-600 font-semibold">
                -{campaign.discount2}%
              </span>
            </div>
          )}

          {campaign.discount3 !== undefined && campaign.discount3 > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Khuyến mãi 3:</span>
              <span className="text-green-600 font-semibold">
                -{campaign.discount3}%
              </span>
            </div>
          )}

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

          {/* Final Price */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-lg font-semibold text-gray-800">
              Tổng thanh toán:
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {campaign.finalPrice.toLocaleString('vi-VN')} ₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
