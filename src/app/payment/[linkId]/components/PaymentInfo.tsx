'use client';

import { useState, useEffect } from 'react';
import { PublicOrder } from '@/lib/types/payment.types';
import { ClipboardDocumentIcon, CheckIcon, ArrowDownTrayIcon, ClockIcon } from '@heroicons/react/24/outline';

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
    const qrCodeUrl = order.payment_info?.qr_code_url || 
      (order.virtual_account ? `https://img.vietqr.io/image/msb-134199-compact2.jpg?amount=${order.virtual_account.equal_amount}&addInfo=${encodeURIComponent(order.order_code)}` : null);

    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR-${order.order_code}.jpg`;
      link.click();
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  if (!order.virtual_account && !order.payment_info) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckIcon className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Đăng ký thành công!
        </h2>
        <p className="text-gray-600 mb-4">
          Mã đơn hàng: <span className="font-mono font-bold text-[#F5A623]">{order.order_code}</span>
        </p>
        <p className="text-gray-500">
          Thông tin thanh toán sẽ được gửi qua email.
        </p>
      </div>
    );
  }

  const paymentData = order.payment_info ? {
    bankName: order.payment_info.bank_name,
    accountName: order.payment_info.account_holder,
    accountNumber: order.payment_info.account_number,
    amount: order.payment_info.amount,
    content: order.payment_info.description,
    qrCode: order.payment_info.qr_code_url
  } : order.virtual_account ? {
    bankName: "MSB - Hàng Hải Việt Nam",
    accountName: order.virtual_account.name,
    accountNumber: "134199", // Hardcoded as requested previously for VA flow fallback
    amount: order.virtual_account.equal_amount,
    content: order.order_code,
    qrCode: `https://img.vietqr.io/image/msb-134199-compact2.jpg?amount=${order.virtual_account.equal_amount}&addInfo=${encodeURIComponent(order.order_code)}`
  } : null;

  if (!paymentData) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-[#F5A623] p-4 text-center">
        <h2 className="text-white font-bold text-lg">THÔNG TIN CHUYỂN KHOẢN</h2>
        <p className="text-white/90 text-sm">Vui lòng chuyển khoản chính xác số tiền bên dưới</p>
      </div>

      <div className="p-6 lg:p-8">
        {/* Timer */}
        {timeRemaining && (
          <div className="flex items-center justify-center gap-2 text-orange-600 bg-orange-50 py-2 px-4 rounded-lg mb-8 w-fit mx-auto">
            <ClockIcon className="w-5 h-5" />
            <span className="font-medium">Hết hạn trong: {timeRemaining}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Code */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={paymentData.qrCode}
                alt="QR Code thanh toán"
                className="w-48 h-48 object-contain"
              />
            </div>
            <button
              onClick={downloadQR}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#F5A623] transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Tải mã QR
            </button>
          </div>

          {/* Bank Details */}
          <div className="space-y-5">
            <div>
              <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Ngân hàng</label>
              <p className="text-gray-900 font-medium text-lg">{paymentData.bankName}</p>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Chủ tài khoản</label>
              <p className="text-gray-900 font-medium text-lg">{paymentData.accountName}</p>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Số tài khoản</label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-[#F5A623] font-mono tracking-wide">{paymentData.accountNumber}</p>
                <button
                  onClick={() => copyToClipboard(paymentData.accountNumber, 'account')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-[#F5A623]"
                  title="Sao chép số tài khoản"
                >
                  {copySuccess === 'account' ? (
                    <CheckIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <ClipboardDocumentIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Số tiền</label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-[#F5A623]">{formatCurrency(paymentData.amount)}</p>
                <button
                  onClick={() => copyToClipboard(paymentData.amount.toString(), 'amount')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-[#F5A623]"
                  title="Sao chép số tiền"
                >
                  {copySuccess === 'amount' ? (
                    <CheckIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <ClipboardDocumentIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Nội dung chuyển khoản</label>
              <div className="flex items-center gap-2 mt-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-mono font-medium flex-1">{paymentData.content}</p>
                <button
                  onClick={() => copyToClipboard(paymentData.content, 'content')}
                  className="text-gray-400 hover:text-[#F5A623] transition-colors"
                  title="Sao chép nội dung"
                >
                  {copySuccess === 'content' ? (
                    <CheckIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <ClipboardDocumentIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-red-500 mt-1">* Vui lòng nhập chính xác nội dung chuyển khoản</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm animate-pulse">
            <div className="w-2 h-2 bg-[#F5A623] rounded-full"></div>
            Đang chờ thanh toán... Hệ thống sẽ tự động xác nhận sau ít phút
          </div>
        </div>
      </div>
    </div>
  );
}
