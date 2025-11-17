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

  const downloadQR = () => {
    if (!order.virtual_account?.qr_code) return;

    const link = document.createElement('a');
    link.href = order.virtual_account.qr_code;
    link.download = `QR-${order.order_code}.png`;
    link.click();
  };

  if (!order.virtual_account) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="text-green-500 text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Đăng ký thành công!
          </h2>
          <p className="text-gray-600 mb-2">
            Mã đơn hàng: <span className="font-mono font-semibold">{order.order_code}</span>
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
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-green-500 text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Đăng ký thành công!
        </h1>
        <p className="text-gray-600">
          Mã đơn hàng: <span className="font-mono font-semibold">{order.order_code}</span>
        </p>
      </div>

      {/* Payment Information Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
          💳 THÔNG TIN THANH TOÁN
        </h2>

        {/* Bank Info */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b">
            <span className="font-semibold text-gray-700 mb-1 sm:mb-0">🏦 Ngân hàng:</span>
            <span className="text-gray-900">{va.bank_name} - Ngân hàng TMCP Hàng Hải Việt Nam</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b">
            <span className="font-semibold text-gray-700 mb-1 sm:mb-0">👤 Chủ tài khoản:</span>
            <span className="text-gray-900">{va.account_name}</span>
          </div>

          <div className="flex flex-col py-3 border-b">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">💰 Số tiền:</span>
              <button
                onClick={() => copyToClipboard(va.amount.toString(), 'amount')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
              >
                {copySuccess === 'amount' ? '✓ Đã copy' : '📋 Copy'}
              </button>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(va.amount)}
            </span>
          </div>

          <div className="flex flex-col py-3 border-b">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">🔢 Số tài khoản:</span>
              <button
                onClick={() => copyToClipboard(va.account_number, 'account')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
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
            <div className="border-4 border-blue-500 rounded-lg p-3 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={va.qr_code}
                alt="QR Code thanh toán"
                className="w-64 h-64"
              />
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={downloadQR}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              ⬇️ Tải mã QR
            </button>
          </div>
        </div>

        {/* Timer Section */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-center text-orange-800">
            ⏰ Vui lòng thanh toán trong:{' '}
            <span className="font-bold text-orange-900">{timeRemaining}</span>
          </p>
        </div>

        {/* Notes Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">📌 Lưu ý:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                Chuyển khoản <strong>ĐÚNG số tiền</strong>: {formatCurrency(va.amount)}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Không cần ghi nội dung chuyển khoản</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                Sau khi chuyển khoản, đơn hàng tự động cập nhật trong vài phút
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="px-4 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
            📖 Hướng dẫn thanh toán
          </button>
          <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            🔍 Kiểm tra trạng thái
          </button>
        </div>
      </div>
    </div>
  );
}
