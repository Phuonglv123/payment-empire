'use client';

import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '@/lib/services/payment.service';
import { PaymentLinkData, VietQRPaymentInfo, PaymentStatusResponse, PublicOrder } from '@/lib/types/payment.types';
import CampaignInfo from './components/CampaignInfo';
import CustomerForm, { CustomerFormData } from './components/CustomerForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ExclamationTriangleIcon, CheckCircleIcon, ShieldCheckIcon, ClipboardDocumentIcon, CheckIcon, ArrowDownTrayIcon, ClockIcon } from '@heroicons/react/24/outline';

interface PaymentPageProps {
  linkId: string;
}

type PaymentStep = 'form' | 'payment' | 'waiting' | 'success';

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
  const [isProcessing, setIsProcessing] = useState(false);
  
  // New states for VietQR flow
  const [currentStep, setCurrentStep] = useState<PaymentStep>('form');
  const [orderData, setOrderData] = useState<PublicOrder | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<VietQRPaymentInfo | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResponse | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkId]);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const paymentLink = await paymentService.getPaymentLink(linkId);
      
      console.log('📋 Payment Link Data:', {
        final_amount: paymentLink.final_amount,
        deposit_amount: paymentLink.deposit_amount,
        is_deposit: paymentLink.is_deposit,
        promotion_amount: paymentLink.promotion_amount,
        selected_promotion: paymentLink.selected_promotion
      });
      
      if (paymentLink.is_expired) {
        setError('Link thanh toán đã hết hạn');
        return;
      }

      const expiryDate = new Date(paymentLink.expires_at);
      if (expiryDate < new Date()) {
        setError('Link thanh toán đã hết hạn');
        return;
      }

      // Check if campaign has reached maximum quantity
      const campaign = paymentLink.campaign;
      if (campaign.used_quantity !== undefined && 
          campaign.max_quantity !== undefined && 
          campaign.used_quantity >= campaign.max_quantity) {
        setError('Chương trình đã hết hạn');
        return;
      }

      setPaymentLinkData(paymentLink);
    } catch (err: unknown) {
      console.error('Error loading payment data:', err);
      setError('Link thanh toán không tồn tại hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  // Polling for payment status
  const startStatusPolling = useCallback(() => {
    if (!paymentInfo) return;

    const intervalId = setInterval(async () => {
      try {
        const status = await paymentService.checkPaymentStatus(paymentInfo.payment_id);
        setPaymentStatus(status);
        
        if (status.status === 'completed') {
          setCurrentStep('success');
          clearInterval(intervalId);
        } else if (status.status === 'cancelled' || status.status === 'expired') {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, [paymentInfo]);

  useEffect(() => {
    if (currentStep === 'payment' || currentStep === 'waiting') {
      const cleanup = startStatusPolling();
      return cleanup;
    }
  }, [currentStep, startStatusPolling]);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentLinkData) return;

    if (!customerInfo.fullName || !customerInfo.phoneNumber || !customerInfo.email) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Số điện thoại và Email)');
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
    if (customerInfo.secondPhoneNumber) {
      finalNotes += `\n[SĐT 2: ${customerInfo.secondPhoneNumber}]`;
    }
    const shippingAddress = `${customerInfo.shippingAddressDetail}, ${customerInfo.shippingWard.name}, ${customerInfo.shippingDistrict.name}, ${customerInfo.shippingProvince.name}`;
    finalNotes += `\n[Địa chỉ nhận sách: ${shippingAddress}]`;

    try {
      setIsProcessing(true);
      setError(null);

      const response = await paymentService.createOrder({
        campaign_id: paymentLinkData.campaign.id,
        payment_link_token: linkId,
        customer_name: customerInfo.fullName,
        customer_phone: customerInfo.phoneNumber,
        customer_email: customerInfo.email || undefined,
        customer_address: billingAddress,
        address_level_1: JSON.stringify(invoiceAddressObj),
        address_level_2: JSON.stringify(shippingAddressObj),
        notes: finalNotes || undefined,
        promotion_code: paymentLinkData.selected_promotion ? paymentLinkData.selected_promotion.toUpperCase() : undefined,
      });
      
      console.log('📊 Order created:', {
        order: response.data,
        payment_info: response.payment_info,
      });
      
      // Store order and payment info
      setOrderData(response.data);
      setPaymentInfo(response.payment_info);
      
      // Move to payment step
      setCurrentStep('payment');
      setIsProcessing(false);
    } catch (err: unknown) {
      console.error('Error processing payment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.';
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentInfo) return;

    try {
      await paymentService.confirmPayment(paymentInfo.payment_id);
      setCurrentStep('waiting');
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại.');
    }
  };

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
    if (!paymentInfo) return;

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

  // Success Step
  if (currentStep === 'success') {
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
            {orderData && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã đơn hàng</span>
                  <span className="font-mono font-bold text-gray-900">{orderData.order_code}</span>
                </div>
                {paymentInfo && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Số tiền</span>
                    <span className="font-bold text-[#F5A623]">{formatCurrency(paymentInfo.amount)}</span>
                  </div>
                )}
              </div>
            )}
            <a 
              href="/"
              className="w-full inline-block bg-[#F5A623] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#E09612] transition-colors shadow-lg shadow-orange-200"
            >
              Về trang chủ
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Waiting Step - Customer confirmed, waiting for admin approval
  if (currentStep === 'waiting') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClockIcon className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang xác nhận thanh toán</h2>
            <p className="text-gray-600 mb-6">
              Chúng tôi đã nhận được xác nhận của bạn. Vui lòng đợi admin xác nhận thanh toán.
            </p>
            {orderData && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã đơn hàng</span>
                  <span className="font-mono font-bold text-gray-900">{orderData.order_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Trạng thái</span>
                  <span className="font-medium text-yellow-600">
                    {paymentStatus?.status === 'confirmed' ? 'Đã xác nhận - chờ duyệt' : 'Đang xử lý'}
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm animate-pulse mb-6">
              <div className="w-2 h-2 bg-[#F5A623] rounded-full"></div>
              Hệ thống sẽ tự động cập nhật khi thanh toán được xác nhận
            </div>
            <a 
              href="/"
              className="w-full inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Về trang chủ
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Payment Step - Show QR Code
  if (currentStep === 'payment' && paymentInfo) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        
        <main className="flex-1 py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Thanh toán đơn hàng
              </h1>
              <p className="text-gray-600">
                Mã đơn hàng: <span className="font-mono font-bold text-[#F5A623]">{paymentInfo.order_code}</span>
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mt-2">
                <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                <span>Thông tin được bảo mật an toàn 100%</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-[#F5A623] p-4 text-center">
                <h2 className="text-white font-bold text-lg">THÔNG TIN CHUYỂN KHOẢN</h2>
                <p className="text-white/90 text-sm">Vui lòng chuyển khoản chính xác số tiền bên dưới</p>
              </div>

              <div className="p-6 lg:p-8">
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
                  <button
                    onClick={handleConfirmPayment}
                    className="w-full bg-[#F5A623] hover:bg-[#E09612] text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-orange-100"
                  >
                    Tôi đã thanh toán
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-sm animate-pulse">
                    <div className="w-2 h-2 bg-[#F5A623] rounded-full"></div>
                    Đang chờ thanh toán... Hệ thống sẽ tự động xác nhận sau ít phút
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Form Step - Customer fills in information
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

              {/* Right Column: Payment Form */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="p-6 lg:p-8">
                    <CustomerForm 
                      customerInfo={customerInfo}
                      onChange={setCustomerInfo}
                    />
                    
                    {error && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}
                    
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
                        Bạn sẽ được chuyển đến trang thanh toán bằng mã QR VietQR
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

