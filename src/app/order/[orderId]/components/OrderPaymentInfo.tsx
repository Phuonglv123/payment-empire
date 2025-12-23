'use client';

import { useState } from 'react';
import { OrderPaymentInfo as PaymentInfoType } from '@/lib/types/payment.types';
import { ClipboardDocumentIcon, CheckIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface OrderPaymentInfoProps {
  paymentInfo: PaymentInfoType;
  amount: number;
  transactionType: string;
}

export default function OrderPaymentInfo({ paymentInfo, amount, transactionType }: OrderPaymentInfoProps) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

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

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Thanh toán đặt cọc';
      case 'remaining':
        return 'Thanh toán còn lại';
      case 'full':
        return 'Thanh toán đầy đủ';
      default:
        return 'Thanh toán';
    }
  };

  // Generate VietQR URL
  const bankInfo = getBankInfo(paymentInfo.bank_name);
  const qrCodeUrl = `https://img.vietqr.io/image/${bankInfo.bin}-${paymentInfo.account_number}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(paymentInfo.transfer_note)}&accountName=${encodeURIComponent(paymentInfo.account_name)}`;

  const downloadQR = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR-${paymentInfo.transfer_note}.jpg`;
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
        <p className="text-white/90 text-sm">{getTransactionTypeLabel(transactionType)}</p>
      </div>

      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Code */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
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
              <p className="text-gray-900 font-medium text-lg">{paymentInfo.account_name}</p>
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
                <p className="text-2xl font-bold text-[#F5A623]">{formatCurrency(amount)}</p>
                <button
                  onClick={() => copyToClipboard(amount.toString(), 'amount')}
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
                <p className="text-gray-900 font-mono font-medium flex-1">{paymentInfo.transfer_note}</p>
                <button
                  onClick={() => copyToClipboard(paymentInfo.transfer_note, 'content')}
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

// Helper function to get bank BIN from bank name
function getBankInfo(bankName: string): { bin: string; shortName: string } {
  const bankMapping: Record<string, { bin: string; shortName: string }> = {
    'MSB': { bin: '970426', shortName: 'msb' },
    'Hàng Hải': { bin: '970426', shortName: 'msb' },
    'VCB': { bin: '970436', shortName: 'vcb' },
    'Vietcombank': { bin: '970436', shortName: 'vcb' },
    'TCB': { bin: '970407', shortName: 'tcb' },
    'Techcombank': { bin: '970407', shortName: 'tcb' },
    'MB': { bin: '970422', shortName: 'mb' },
    'MBBank': { bin: '970422', shortName: 'mb' },
    'ACB': { bin: '970416', shortName: 'acb' },
    'VPB': { bin: '970432', shortName: 'vpb' },
    'VPBank': { bin: '970432', shortName: 'vpb' },
    'TPB': { bin: '970423', shortName: 'tpb' },
    'TPBank': { bin: '970423', shortName: 'tpb' },
    'BIDV': { bin: '970418', shortName: 'bidv' },
    'VTB': { bin: '970415', shortName: 'vtb' },
    'Vietinbank': { bin: '970415', shortName: 'vtb' },
    'Agribank': { bin: '970405', shortName: 'agribank' },
  };

  // Find matching bank
  for (const [key, value] of Object.entries(bankMapping)) {
    if (bankName.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Default to MSB if not found
  return { bin: '970426', shortName: 'msb' };
}
