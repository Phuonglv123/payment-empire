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
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-600 mb-4">
              Cảm ơn bạn đã thanh toán. Chúng tôi đã gửi email xác nhận và thông tin đăng nhập đến địa chỉ email của bạn.
            </p>
            <p className="text-sm text-gray-500">
              Mã đơn hàng: <span className="font-mono font-semibold">ORDER-DEMO-12345</span>
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-yellow-800">
                <strong>Demo Mode:</strong> Đây là phiên bản demo với dữ liệu tĩnh. QR code sẽ tự động &quot;thanh toán thành công&quot; sau 5 giây.
              </p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Trang thanh toán
          </h1>

          <div className="space-y-6">
            {/* Campaign Information */}
            <CampaignInfo 
              campaign={mockCampaign}
              productName="Full Stack Development Course"
              basePrice={15000000}
              discountPercent={10}
              finalPrice={13500000}
              notes="Ưu đãi đặc biệt cho học viên đăng ký sớm"
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
                <div className="bg-white rounded-lg shadow-md p-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                  >
                    Thanh toán
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
