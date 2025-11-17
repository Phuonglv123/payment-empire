'use client';

import { useState } from 'react';
import CampaignInfo from '@/app/payment/[linkId]/components/CampaignInfo';
import CustomerForm from '@/app/payment/[linkId]/components/CustomerForm';
import PaymentMethod from '@/app/payment/[linkId]/components/PaymentMethod';
import QRCodeDisplay from '@/app/payment/[linkId]/components/QRCodeDisplay';
import { Campaign } from '@/lib/types/payment.types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock campaign data for demo purposes
const mockCampaign: Campaign = {
  id: 'campaign-demo-123',
  name: 'Khóa học lập trình Full Stack 2025',
  description: 'Khóa học 6 tháng với mentor 1-1. Bao gồm: học liệu độc quyền, hỗ trợ 24/7, và nhiều ưu đãi khác.',
  original_price: 15000000,
  km01_price: 13500000,
  km02_price: 14000000,
  km03_price: 14500000,
};

interface CustomerFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  notes?: string;
}

export default function DemoPaymentPage() {
  const [customerInfo, setCustomerInfo] = useState<CustomerFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
  });
  const [showQRCode, setShowQRCode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.fullName || !customerInfo.phoneNumber) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Show QR code
    setShowQRCode(true);

    // Simulate payment success after 5 seconds
    setTimeout(() => {
      setShowSuccess(true);
    }, 5000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center border border-gray-100">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã thanh toán. Chúng tôi đã gửi email xác nhận và thông tin đăng nhập đến địa chỉ email của bạn.
            </p>
            <div className="bg-gradient-to-br from-[#FFF8E8] to-[#FFE8B8] rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">
                Mã đơn hàng: <span className="font-mono font-bold text-[#F5A623]">ORDER-DEMO-12345</span>
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-gradient-to-r from-[#F5A623] to-[#FF8C00] hover:from-[#E09200] hover:to-[#F57C00] text-white font-bold py-2 px-6 rounded-lg transition-all shadow-md"
            >
              Thử lại
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-[#FFF8E8]">
      <Header />
      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6 bg-gradient-to-r from-[#FFF8E8] to-[#FFE8B8] border border-[#F5A623] rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[#F5A623] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-800 font-medium">
                <strong>Demo Mode:</strong> Đây là phiên bản demo với dữ liệu tĩnh. QR code sẽ tự động &quot;thanh toán thành công&quot; sau 5 giây.
              </p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              <span className="text-[#F5A623]">👑</span> EMPIRE EDUCATION
            </h1>
            <p className="text-lg text-gray-600">Trang thanh toán (Demo)</p>
          </div>

          <div className="space-y-6">
            {/* Campaign Information */}
            <CampaignInfo 
              campaign={mockCampaign}
              selectedPromotion="km01"
              promotionAmount={1500000}
              isDeposit={false}
              depositAmount={0}
              finalAmount={13500000}
            />

            {!showQRCode ? (
              <form onSubmit={handleSubmitPayment} className="space-y-6">
                {/* Customer Information Form */}
                <CustomerForm
                  customerInfo={customerInfo}
                  onChange={setCustomerInfo}
                />

                {/* Payment Method */}
                <PaymentMethod bankCode="MSB" />

                {/* Submit Button */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#F5A623] to-[#FF8C00] hover:from-[#E09200] hover:to-[#F57C00] text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-md"
                  >
                    <span className="flex items-center justify-center">
                      <span>👑</span>
                      <span className="ml-2">THANH TOÁN</span>
                    </span>
                  </button>
                </div>
              </form>
            ) : (
              <QRCodeDisplay
                qrCodeUrl="/next.svg"
                amount={13500000}
                isCheckingPayment={true}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
