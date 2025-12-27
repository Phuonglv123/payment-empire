'use client';

import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '@/lib/services/payment.service';
import { VietQRPaymentInfo, PaymentStatusResponse } from '@/lib/types/payment.types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderPaymentInfo from './components/OrderPaymentInfo';
import { ExclamationTriangleIcon, CheckCircleIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';

interface OrderPaymentPageProps {
  orderId: string;
}

export default function OrderPaymentPage({ orderId }: OrderPaymentPageProps) {
  const [paymentInfo, setPaymentInfo] = useState<VietQRPaymentInfo | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const loadOrderData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await paymentService.getPaymentByOrderId(orderId);
      setPaymentInfo(data);
      
      // Also check payment status
      const status = await paymentService.checkPaymentStatus(data.payment_id);
      setPaymentStatus(status);
    } catch (err: unknown) {
      console.error('Error loading order data:', err);
      setError('Không tìm thấy thông tin đơn hàng hoặc đơn hàng đã hết hạn');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrderData();
  }, [loadOrderData]);

  // Poll for payment status
  useEffect(() => {
    if (!paymentInfo || paymentStatus?.status === 'completed') return;

    const interval = setInterval(async () => {
      try {
        const status = await paymentService.checkPaymentStatus(paymentInfo.payment_id);
        setPaymentStatus(status);
        if (status.status === 'completed' || status.status === 'cancelled' || status.status === 'expired') {
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [paymentInfo, paymentStatus?.status]);

  const handleConfirmPayment = async () => {
    if (!paymentInfo) return;

    try {
      setIsConfirming(true);
      await paymentService.confirmPayment(paymentInfo.payment_id);
      setHasConfirmed(true);
      
      // Refresh status
      const status = await paymentService.checkPaymentStatus(paymentInfo.payment_id);
      setPaymentStatus(status);
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại.');
    } finally {
      setIsConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5A623] mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !paymentInfo) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExclamationTriangleIcon className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Không tìm thấy đơn hàng</h2>
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

  // Payment completed
  if (paymentStatus?.status === 'completed') {
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
              Cảm ơn bạn đã thanh toán. Thông tin đơn hàng đã được cập nhật.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 text-left">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã đơn hàng</span>
                <span className="font-mono font-bold text-gray-900">{paymentInfo.order_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số tiền đã thanh toán</span>
                <span className="font-bold text-[#F5A623]">
                  {new Intl.NumberFormat('vi-VN').format(paymentInfo.amount)} ₫
                </span>
              </div>
            </div>
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

  // Waiting for admin confirmation
  if (hasConfirmed || paymentStatus?.status === 'confirmed') {
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
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 text-left">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã đơn hàng</span>
                <span className="font-mono font-bold text-gray-900">{paymentInfo.order_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Trạng thái</span>
                <span className="font-medium text-yellow-600">Đã xác nhận - chờ duyệt</span>
              </div>
            </div>
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

          <OrderPaymentInfo 
            paymentInfo={paymentInfo}
            onConfirm={handleConfirmPayment}
            isConfirming={isConfirming}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
