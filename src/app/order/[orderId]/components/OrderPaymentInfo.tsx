'use client';

import { useState, useEffect } from 'react';
import { VietQRPaymentInfo } from '@/lib/types/payment.types';
import { ClipboardDocumentIcon, CheckIcon, ArrowDownTrayIcon, ClockIcon } from '@heroicons/react/24/outline';

interface OrderPaymentInfoProps {
  paymentInfo: VietQRPaymentInfo;
  onConfirm?: () => void;
  isConfirming?: boolean;
}

export default function OrderPaymentInfo({ paymentInfo, onConfirm, isConfirming }: OrderPaymentInfoProps) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Update countdown timer
  useEffect(() => {
    if (!paymentInfo?.expires_at) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(paymentInfo.expires_at).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeRemaining('Đã hết hạn');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(
          `${days} ngày ${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      } else {
        setTimeRemaining(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [paymentInfo]);

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
    if (!paymentInfo?.qr_code_url) return;

    try {
      const response = await fetch(paymentInfo.qr_code_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR-${paymentInfo.order_code}.jpg`;
      link.click();
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

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
                src={paymentInfo.qr_code_url}
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
              <p className="text-gray-900 font-medium text-lg">{paymentInfo.bank_name}</p>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Chủ tài khoản</label>
              <p className="text-gray-900 font-medium text-lg">{paymentInfo.account_holder}</p>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Số tài khoản</label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-[#F5A623] font-mono tracking-wide">{paymentInfo.account_number}</p>
                <button
                  onClick={() => copyToClipboard(paymentInfo.account_number, 'account')}
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
                <p className="text-2xl font-bold text-[#F5A623]">{formatCurrency(paymentInfo.amount)}</p>
                <button
                  onClick={() => copyToClipboard(paymentInfo.amount.toString(), 'amount')}
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
                <p className="text-gray-900 font-mono font-medium flex-1">{paymentInfo.description}</p>
                <button
                  onClick={() => copyToClipboard(paymentInfo.description, 'content')}
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

        {/* Instructions */}
        <div className="mt-8 bg-gradient-to-r from-[#FFF8E8] to-[#FFE8B8] border border-[#F5A623] rounded-lg p-4">
          <h4 className="font-bold text-gray-800 mb-2">Hướng dẫn thanh toán:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Mở ứng dụng ngân hàng trên điện thoại của bạn</li>
            <li>Chọn tính năng &quot;Quét mã QR&quot; hoặc &quot;Chuyển khoản&quot;</li>
            <li>Quét mã QR hoặc nhập thông tin chuyển khoản ở trên</li>
            <li>Xác nhận thông tin và hoàn tất giao dịch</li>
            <li>Nhấn nút &quot;Tôi đã thanh toán&quot; bên dưới</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
          {onConfirm && (
            <button
              onClick={onConfirm}
              disabled={isConfirming}
              className="w-full bg-[#F5A623] hover:bg-[#E09612] text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-orange-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isConfirming ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>Tôi đã thanh toán</span>
              )}
            </button>
          )}
          
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm animate-pulse">
            <div className="w-2 h-2 bg-[#F5A623] rounded-full"></div>
            Đang chờ thanh toán... Hệ thống sẽ tự động xác nhận sau ít phút
          </div>
        </div>
      </div>
    </div>
  );
}
