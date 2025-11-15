'use client';

import { useState, useEffect } from 'react';
import { paymentService } from '@/lib/services/payment.service';
import { Campaign, CustomerInfo, PaymentOrder } from '@/lib/types/payment.types';
import CampaignInfo from './components/CampaignInfo';
import CustomerForm from './components/CustomerForm';
import PaymentMethod from './components/PaymentMethod';
import QRCodeDisplay from './components/QRCodeDisplay';

interface PaymentPageProps {
  linkId: string;
}

export default function PaymentPage({ linkId }: PaymentPageProps) {
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
      
      if (!paymentLink.isValid) {
        setError('Link thanh toán không hợp lệ hoặc đã hết hạn');
        return;
      }

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
        campaign.bankCode || 'MSB'
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-lg text-gray-700 font-semibold">Đang tải thông tin...</p>
          <p className="mt-2 text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error && !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-md text-center border border-gray-100">
          <div className="inline-block p-4 bg-red-100 rounded-full mb-6">
            <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (order && order.status === 'paid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-md text-center border border-gray-100">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-6 animate-bounce">
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Thanh toán thành công!</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-gray-700 leading-relaxed">
              Cảm ơn bạn đã thanh toán. Chúng tôi đã gửi email xác nhận và thông tin đăng nhập đến địa chỉ email của bạn.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
            <p className="font-mono font-bold text-lg text-gray-800">{order.id}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Trang thanh toán
          </h1>
          <p className="text-gray-600">
            Hoàn tất thông tin để tiến hành thanh toán
          </p>
        </div>

        {campaign && (
          <div className="space-y-6">
            {/* Campaign Information */}
            <CampaignInfo campaign={campaign} />

            {!qrCodeUrl ? (
              <form onSubmit={handleSubmitPayment} className="space-y-6">
                {/* Customer Information Form */}
                <CustomerForm
                  customerInfo={customerInfo}
                  onChange={setCustomerInfo}
                />

                {/* Payment Method */}
                <PaymentMethod bankCode={campaign.bankCode || 'MSB'} />

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-5 px-6 rounded-xl transition-all disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-lg">Đang xử lý...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center text-lg">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Xác nhận thanh toán
                      </span>
                    )}
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Nhấn để tạo mã QR thanh toán
                  </p>
                </div>
              </form>
            ) : (
              <QRCodeDisplay
                qrCodeUrl={qrCodeUrl}
                amount={campaign.finalPrice}
                isCheckingPayment={isCheckingPayment}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
