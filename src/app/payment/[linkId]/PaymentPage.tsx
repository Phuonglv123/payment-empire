'use client';

import { useState, useEffect } from 'react';
import { paymentService } from '@/lib/services/payment.service';
import { Campaign, CustomerInfo, PaymentOrder, PaymentLinkData } from '@/lib/types/payment.types';
import CampaignInfo from './components/CampaignInfo';
import CustomerForm from './components/CustomerForm';
import PaymentMethod from './components/PaymentMethod';
import QRCodeDisplay from './components/QRCodeDisplay';

interface PaymentPageProps {
  linkId: string;
}

export default function PaymentPage({ linkId }: PaymentPageProps) {
  const [paymentLinkData, setPaymentLinkData] = useState<PaymentLinkData | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
  });
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  useEffect(() => {
    loadPaymentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkId]);

  // Poll for payment status when QR code is displayed
  useEffect(() => {
    if (!order || order.status === 'paid') return;

    const interval = setInterval(async () => {
      try {
        setIsCheckingPayment(true);
        const updatedOrder = await paymentService.checkOrderStatus(order.id);
        if (updatedOrder.status === 'paid') {
          setOrder(updatedOrder);
          clearInterval(interval);
          // Redirect or show success message
          alert('Thanh toán thành công! Bạn sẽ nhận được email xác nhận trong giây lát.');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      } finally {
        setIsCheckingPayment(false);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [order]);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get payment link data which includes campaign information
      const paymentLink = await paymentService.getPaymentLink(linkId);
      
      if (paymentLink.is_expired || paymentLink.errorCode !== 'SUCCESS') {
        setError('Link thanh toán không hợp lệ hoặc đã hết hạn');
        return;
      }

      setPaymentLinkData(paymentLink);
      setCampaign(paymentLink.campaign);
    } catch (err) {
      console.error('Error loading payment data:', err);
      setError('Không thể tải thông tin thanh toán. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaign) return;

    // Validate customer info
    if (!customerInfo.fullName || !customerInfo.phoneNumber || !customerInfo.email || !customerInfo.address) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Create order
      const newOrder = await paymentService.createOrder(campaign.id, customerInfo);
      setOrder(newOrder);

      // Generate QR code
      const qrResponse = await paymentService.generateQRCode(
        newOrder.id,
        'MSB' // Default bank code
      );
      
      setQrCodeUrl(qrResponse.qrCodeUrl);
    } catch (err) {
      console.error('Error processing payment:', err);
      setError('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error && !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (order && order.status === 'paid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Thanh toán thành công!</h2>
          <p className="text-gray-600 mb-4">
            Cảm ơn bạn đã thanh toán. Chúng tôi đã gửi email xác nhận và thông tin đăng nhập đến địa chỉ email của bạn.
          </p>
          <p className="text-sm text-gray-500">
            Mã đơn hàng: <span className="font-mono font-semibold">{order.id}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Trang thanh toán
        </h1>

        {campaign && paymentLinkData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Campaign Information (1/3 width) */}
            <div className="lg:col-span-1">
              <CampaignInfo 
                campaign={campaign}
                selectedPromotion={paymentLinkData.selected_promotion}
                promotionAmount={paymentLinkData.promotion_amount}
                isDeposit={paymentLinkData.is_deposit}
                depositAmount={paymentLinkData.deposit_amount}
                finalAmount={paymentLinkData.final_amount}
              />
            </div>

            {/* Right Column - Payment Form/QR Code (2/3 width) */}
            <div className="lg:col-span-2">
              {!qrCodeUrl ? (
                <form onSubmit={handleSubmitPayment} className="space-y-6">
                  {/* Customer Information Form */}
                  <CustomerForm
                    customerInfo={customerInfo}
                    onChange={setCustomerInfo}
                  />

                  {/* Payment Method */}
                  <PaymentMethod bankCode='MSB' />

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang xử lý...
                        </span>
                      ) : (
                        'Thanh toán'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <QRCodeDisplay
                  qrCodeUrl={qrCodeUrl}
                  amount={paymentLinkData.final_amount}
                  isCheckingPayment={isCheckingPayment}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
