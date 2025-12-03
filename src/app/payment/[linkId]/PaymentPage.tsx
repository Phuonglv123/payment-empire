'use client';

import { useState, useEffect } from 'react';
import { paymentService } from '@/lib/services/payment.service';
import { PaymentLinkData, PublicOrder } from '@/lib/types/payment.types';
import CampaignInfo from './components/CampaignInfo';
import CustomerForm, { CustomerFormData } from './components/CustomerForm';
import PaymentInfo from './components/PaymentInfo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ExclamationTriangleIcon, CheckCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface PaymentPageProps {
  linkId: string;
}

export default function PaymentPage({ linkId }: PaymentPageProps) {
  const [paymentLinkData, setPaymentLinkData] = useState<PaymentLinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    addressDetail: '',
    isShippingSameAsBilling: true,
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
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [order]);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const paymentLink = await paymentService.getPaymentLink(linkId);
      
      if (paymentLink.is_expired) {
        setError('Link thanh toán đã hết hạn');
        return;
      }

      const expiryDate = new Date(paymentLink.expires_at);
      if (expiryDate < new Date()) {
        setError('Link thanh toán đã hết hạn');
        return;
      }

      setPaymentLinkData(paymentLink);
    } catch (err: unknown) {
      console.error('Error loading payment data:', err);
      // If error is 404-like, we can show a specific message
      setError('Link thanh toán không tồn tại hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentLinkData) return;

    if (!customerInfo.fullName || !customerInfo.phoneNumber) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên và Số điện thoại)');
      return;
    }

    if (!customerInfo.province || !customerInfo.ward || !customerInfo.addressDetail) {
      alert('Vui lòng điền đầy đủ địa chỉ xuất hoá đơn');
      return;
    }

    if (!customerInfo.shippingProvince || !customerInfo.shippingDistrict || !customerInfo.shippingWard || !customerInfo.shippingAddressDetail) {
      alert('Vui lòng điền đầy đủ địa chỉ nhận sách');
      return;
    }

    // Construct addresses
    const billingAddress = `${customerInfo.addressDetail}, ${customerInfo.ward.name}, ${customerInfo.province.name}`;
    
    // Create JSON objects for addresses
    const invoiceAddressObj = {
      province: customerInfo.province.name,
      ward: customerInfo.ward.name,
      addressDetail: customerInfo.addressDetail
    };

    const shippingAddressObj = {
      province: customerInfo.shippingProvince.name,
      district: customerInfo.shippingDistrict.name,
      ward: customerInfo.shippingWard.name,
      addressDetail: customerInfo.shippingAddressDetail
    };

    let finalNotes = customerInfo.notes || '';
    const shippingAddress = `${customerInfo.shippingAddressDetail}, ${customerInfo.shippingWard.name}, ${customerInfo.shippingDistrict.name}, ${customerInfo.shippingProvince.name}`;
    finalNotes += `\n[Địa chỉ nhận sách: ${shippingAddress}]`;

    try {
      setIsProcessing(true);
      setError(null);

      const newOrder = await paymentService.createOrder( {
        campaign_id: paymentLinkData.campaign.id,
        payment_link_token: linkId,
        customer_name: customerInfo.fullName,
        customer_phone: customerInfo.phoneNumber,
        customer_email: customerInfo.email || undefined,
        customer_address: billingAddress,
        address_level_1: JSON.stringify(invoiceAddressObj),
        address_level_2: JSON.stringify(shippingAddressObj),
        notes: finalNotes || undefined,
        payment_channel: 'manual_bank_transfer',
        promotion_code: paymentLinkData.selected_promotion ? paymentLinkData.selected_promotion.toUpperCase() : undefined,
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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5A623] mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Đang tải thông tin thanh toán...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !paymentLinkData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExclamationTriangleIcon className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Không tìm thấy trang</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <a href="/" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Về trang chủ
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (order && order.payment_status === 'paid') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã thanh toán. Thông tin đơn hàng đã được gửi đến email của bạn.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 text-left">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã đơn hàng</span>
                <span className="font-mono font-bold text-gray-900">{order.order_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số tiền</span>
                <span className="font-bold text-[#F5A623]">{new Intl.NumberFormat('vi-VN').format(order.total_amount)} ₫</span>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-[#F5A623] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#E09612] transition-colors shadow-lg shadow-orange-200"
            >
              Hoàn tất
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      
      <main className="flex-1 py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Thanh toán đơn hàng
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <ShieldCheckIcon className="w-5 h-5 text-green-500" />
              <span>Thông tin được bảo mật an toàn 100%</span>
            </div>
          </div>

          {paymentLinkData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Order Summary */}
              <div className="lg:col-span-5 space-y-6">
                <CampaignInfo 
                  campaign={paymentLinkData.campaign}
                  selectedPromotion={paymentLinkData.selected_promotion}
                  promotionAmount={paymentLinkData.promotion_amount}
                  isDeposit={paymentLinkData.is_deposit}
                  depositAmount={paymentLinkData.deposit_amount}
                  finalAmount={paymentLinkData.final_amount}
                />
                
                {/* Security Note for Desktop */}
                <div className="hidden lg:block bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-[#F5A623]" />
                    Cam kết bảo mật
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
                      <span>Thông tin thanh toán được mã hóa an toàn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
                      <span>Xác nhận thanh toán tự động 24/7</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
                      <span>Hỗ trợ hoàn tiền nếu có lỗi giao dịch</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Payment Form / Info */}
              <div className="lg:col-span-7">
                {!order ? (
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 lg:p-8">
                      <CustomerForm 
                        customerInfo={customerInfo}
                        onChange={setCustomerInfo}
                      />
                      
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <button
                          onClick={handleSubmitPayment}
                          disabled={isProcessing}
                          className="w-full bg-[#F5A623] hover:bg-[#E09612] text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-orange-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Đang xử lý...</span>
                            </>
                          ) : (
                            <span>Tiến hành thanh toán</span>
                          )}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">
                          Bằng việc thanh toán, bạn đồng ý với điều khoản dịch vụ của chúng tôi
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <PaymentInfo order={order} />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

