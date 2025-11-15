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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Campaign Image */}
      {campaign.imageUrl && (
        <div className="relative w-full h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
          <Image
            src={campaign.imageUrl}
            alt={campaign.name}
            fill
            className="object-cover"
            priority
          />
          {totalDiscount > 0 && (
            <div className="absolute top-4 right-4">
              <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
                -{totalDiscount}%
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Campaign Name */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
          <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {campaign.name}
        </h2>

        {/* Campaign Description */}
        {campaign.description && (
          <p className="text-gray-600 mb-4 leading-relaxed bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            {campaign.description}
          </p>
        )}

        {/* Product Name */}
        {campaign.product && (
          <div className="mb-4 flex items-center bg-gray-50 p-3 rounded-lg">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-sm font-semibold text-gray-500">Sản phẩm:</span>
            <span className="ml-2 text-gray-800 font-medium">{campaign.product}</span>
          </div>
        )}

        {/* Pricing Information */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 space-y-3 border border-gray-200">
          {/* Original Price */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Giá gốc:</span>
            <span className="text-gray-400 line-through text-lg">
              {campaign.originalPrice.toLocaleString('vi-VN')} ₫
            </span>
          </div>

          {/* Discounts */}
          {campaign.discount1 !== undefined && campaign.discount1 > 0 && (
            <div className="flex justify-between items-center bg-white rounded-lg p-2 shadow-sm">
              <span className="text-gray-600 flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Khuyến mãi 1:
              </span>
              <span className="text-green-600 font-bold">
                -{campaign.discount1}%
              </span>
            </div>
          )}

          {campaign.discount2 !== undefined && campaign.discount2 > 0 && (
            <div className="flex justify-between items-center bg-white rounded-lg p-2 shadow-sm">
              <span className="text-gray-600 flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Khuyến mãi 2:
              </span>
              <span className="text-green-600 font-bold">
                -{campaign.discount2}%
              </span>
            </div>
          )}

          {campaign.discount3 !== undefined && campaign.discount3 > 0 && (
            <div className="flex justify-between items-center bg-white rounded-lg p-2 shadow-sm">
              <span className="text-gray-600 flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Khuyến mãi 3:
              </span>
              <span className="text-green-600 font-bold">
                -{campaign.discount3}%
              </span>
            </div>
          )}

          {/* Total Discount Badge */}
          {totalDiscount > 0 && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                <span className="font-bold text-xl">
                  🎉 Tiết kiệm {totalDiscount}%
                </span>
              </div>
            </div>
          )}

          {/* Final Price */}
          <div className="flex justify-between items-center pt-3 border-t-2 border-dashed border-gray-300 bg-white rounded-lg p-4 shadow-md">
            <span className="text-lg font-bold text-gray-800 flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tổng thanh toán:
            </span>
            <span className="text-3xl font-bold text-blue-600 animate-pulse">
              {campaign.finalPrice.toLocaleString('vi-VN')} ₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
