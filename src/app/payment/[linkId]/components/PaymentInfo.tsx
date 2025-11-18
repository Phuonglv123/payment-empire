'use client';

import { useState, useEffect } from 'react';
import { PublicOrder } from '@/lib/types/payment.types';

interface PaymentInfoProps {
  order: PublicOrder;
}

export default function PaymentInfo({ order }: PaymentInfoProps) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Update countdown timer
  useEffect(() => {
    const virtualAccount = order.virtual_account;
    if (!virtualAccount?.expiry_date) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(virtualAccount.expiry_date).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeRemaining('Đã hết hạn');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${days} ngày ${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [order.virtual_account]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(label);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const downloadQR = async () => {
    if (!order.virtual_account?.qr_code) return;

    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(order.virtual_account.qr_code)}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR-${order.order_code}.png`;
      link.click();
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  if (!order.virtual_account) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Đăng ký thành công!
          </h2>
          <p className="text-gray-600 mb-2">
            Mã đơn hàng: <span className="font-mono font-bold text-[#F5A623]">{order.order_code}</span>
          </p>
          <p className="text-gray-500">
            Thông tin thanh toán sẽ được gửi qua email.
          </p>
        </div>
      </div>
    );
  }

  const va = order.virtual_account;

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Đăng ký thành công!
        </h1>
        <p className="text-gray-600">
          Mã đơn hàng: <span className="font-mono font-bold text-[#F5A623]">{order.order_code}</span>
        </p>
      </div>

      {/* Payment Information Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="bg-gradient-to-r from-[#F5A623] to-[#FF8C00] rounded-lg p-4 mb-6">
          <h2 className="text-xl font-bold text-center text-white flex items-center justify-center">
            <span className="mr-2">💳</span>
            <span>THÔNG TIN THANH TOÁN</span>
          </h2>
        </div>

        {/* Bank Info */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b">
            <span className="font-semibold text-gray-700 mb-1 sm:mb-0">🏦 Ngân hàng:</span>
            <span className="text-gray-900">MSB - Ngân hàng TMCP Hàng Hải Việt Nam</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b">
            <span className="font-semibold text-gray-700 mb-1 sm:mb-0">👤 Chủ tài khoản:</span>
            <span className="text-gray-900">{va.name}</span>
          </div>

          <div className="flex flex-col py-3 border-b">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">🎫 Mã thanh toán:</span>
              <button
                onClick={() => copyToClipboard(order.order_code, 'order_code')}
                className="px-3 py-1 bg-[#FFF8E8] hover:bg-[#F5A623] hover:text-white border border-[#F5A623] text-[#F5A623] rounded-md text-sm transition-all font-medium"
              >
                {copySuccess === 'order_code' ? '✓ Đã copy' : '📋 Copy'}
              </button>
            </div>
            <span className="text-xl font-bold text-gray-900 font-mono">
              {order.order_code}
            </span>
          </div>

          <div className="flex flex-col py-3 border-b">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">💰 Số tiền:</span>
              <button
                onClick={() => copyToClipboard(va.equal_amount.toString(), 'amount')}
                className="px-3 py-1 bg-[#FFF8E8] hover:bg-[#F5A623] hover:text-white border border-[#F5A623] text-[#F5A623] rounded-md text-sm transition-all font-medium"
              >
                {copySuccess === 'amount' ? '✓ Đã copy' : '📋 Copy'}
              </button>
            </div>
            <span className="text-2xl font-bold text-[#F5A623]">
              {formatCurrency(va.equal_amount)}
            </span>
          </div>

          <div className="flex flex-col py-3 border-b">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">🔢 Số tài khoản:</span>
              <button
                onClick={() => copyToClipboard(va.account_number, 'account')}
                className="px-3 py-1 bg-[#FFF8E8] hover:bg-[#F5A623] hover:text-white border border-[#F5A623] text-[#F5A623] rounded-md text-sm transition-all font-medium"
              >
                {copySuccess === 'account' ? '✓ Đã copy' : '📋 Copy'}
              </button>
            </div>
            <span className="text-xl font-bold text-gray-900 font-mono">
              {va.account_number}
            </span>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="border-t border-b py-6 my-6">
          <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">
            📱 Quét mã QR để thanh toán nhanh
          </h3>
          <div className="flex justify-center mb-4">
            <div className="border-4 border-[#F5A623] rounded-xl p-3 bg-white shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(va.qr_code)}`}
                alt="QR Code thanh toán"
                className="w-64 h-64"
              />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-600 text-center whitespace-pre-wrap break-all">
              {va.qr_code}
            </p>
          </div>
          <div className="text-center">
            <button
              onClick={downloadQR}
              className="px-6 py-3 bg-gradient-to-r from-[#F5A623] to-[#FF8C00] hover:from-[#E09200] hover:to-[#F57C00] text-white font-bold rounded-lg transition-all shadow-md"
            >
              ⬇️ Tải mã QR
            </button>
          </div>
        </div>

        {/* Timer Section */}
        <div className="bg-gradient-to-r from-[#FFF8E8] to-[#FFE8B8] border border-[#F5A623] rounded-lg p-4 mb-6">
          <p className="text-center text-gray-800">
            ⏰ Vui lòng thanh toán trong:{' '}
            <span className="font-bold text-[#F5A623]">{timeRemaining}</span>
          </p>
        </div>

        {/* Notes Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">📌 Lưu ý:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-[#F5A623] mr-2">•</span>
              <span>
                Chuyển khoản <strong>ĐÚNG số tiền</strong>: {formatCurrency(va.equal_amount)}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#F5A623] mr-2">•</span>
              <span>
                Nội dung: <strong>{va.detail1}</strong>
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#F5A623] mr-2">•</span>
              <span>
                Sau khi chuyển khoản, đơn hàng tự động cập nhật trong vài phút
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="px-4 py-3 bg-white border-2 border-[#F5A623] text-[#F5A623] rounded-lg hover:bg-[#FFF8E8] transition-colors font-bold">
            📖 Hướng dẫn thanh toán
          </button>
          <button className="px-4 py-3 bg-gradient-to-r from-[#F5A623] to-[#FF8C00] text-white rounded-lg hover:from-[#E09200] hover:to-[#F57C00] transition-all font-bold shadow-md">
            🔍 Kiểm tra trạng thái
          </button>
        </div>
      </div>
    </div>
  );
}
