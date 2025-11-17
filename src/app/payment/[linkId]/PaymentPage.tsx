'use client';

import { useState, useEffect } from 'react';
import { paymentService } from '@/lib/services/payment.service';
import { PaymentLinkData, PublicOrder } from '@/lib/types/payment.types';
import CampaignInfo from './components/CampaignInfo';
import CustomerForm from './components/CustomerForm';
import PaymentMethod from './components/PaymentMethod';
import PaymentInfo from './components/PaymentInfo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PaymentPageProps {
  linkId: string;
}

interface CustomerFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  notes?: string;
}

export default function PaymentPage({ linkId }: PaymentPageProps) {
  const [paymentLinkData, setPaymentLinkData] = useState<PaymentLinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
  });
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadPaymentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkId]);

  // Poll for payment status when order is created
  useEffect(() => {
    if (!order || order.payment_status === 'paid') return;

    const interval = setInterval(async () => {
      try {
        const updatedOrder = await paymentService.checkOrderStatus(order.id);
        if (updatedOrder.payment_status === 'paid') {
          setOrder(updatedOrder);
          clearInterval(interval);
          alert('Thanh toán thành công! Bạn sẽ nhận được email xác nhận trong giây lát.');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
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
      
      // Check if payment link is valid
      if (!paymentLink.is_active) {
        setError('Link thanh toán không còn hoạt động');
        return;
      }

      const expiryDate = new Date(paymentLink.expires_at);
      if (expiryDate < new Date()) {
        setError('Link thanh toán đã hết hạn');
        return;
      }

      if (paymentLink.current_uses >= paymentLink.max_uses) {
        setError('Link thanh toán đã đạt giới hạn số lượt sử dụng');
        return;
      }

      setPaymentLinkData(paymentLink);
    } catch (err: unknown) {
      console.error('Error loading payment data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin thanh toán. Vui lòng thử lại sau.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentLinkData) return;

    // Validate required fields
    if (!customerInfo.fullName || !customerInfo.phoneNumber) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên và Số điện thoại)');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Create order with payment link token
      // Backend will automatically create Virtual Account and return it
      const newOrder = await paymentService.createOrder({
        payment_link_token: linkId,
        customer_name: customerInfo.fullName,
        customer_phone: customerInfo.phoneNumber,
        customer_email: customerInfo.email || undefined,
        customer_address: customerInfo.address || undefined,
        notes: customerInfo.notes || undefined,
      });
      
      setOrder(newOrder);
    } catch (err: unknown) {
      console.error('Error processing payment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !paymentLinkData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (order && order.payment_status === 'paid') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
            <div className="text-green-500 text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-600 mb-4">
              Cảm ơn bạn đã thanh toán. Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Mã đơn hàng: <span className="font-mono font-semibold">{order.order_code}</span>
            </p>
            <p className="text-sm text-gray-500">
              Số tiền: <span className="font-semibold">{new Intl.NumberFormat('vi-VN').format(order.total_amount)} VND</span>
            </p>
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
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            🎓 EMPIRE EDUCATION - Trang thanh toán
          </h1>

          {paymentLinkData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Campaign Information (1/3 width) */}
              <div className="lg:col-span-1">
                <CampaignInfo 
                  campaign={paymentLinkData.campaign}
                  productName={paymentLinkData.product_name}
                  basePrice={paymentLinkData.base_price}
                  discountPercent={paymentLinkData.discount_percent}
                  finalPrice={paymentLinkData.final_price}
                  notes={paymentLinkData.notes}
                />
              </div>

              {/* Right Column - Payment Form or Payment Info (2/3 width) */}
              <div className="lg:col-span-2">
                {!order ? (
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
                          'ĐĂNG KÝ VÀ THANH TOÁN'
                        )}
                      </button>
                      <p className="text-center text-sm text-gray-500 mt-3">
                        Bằng việc đăng ký, bạn đồng ý với điều khoản sử dụng
                      </p>
                    </div>
                  </form>
                ) : (
                  <PaymentInfo order={order} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
