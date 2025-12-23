'use client';

import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '@/lib/services/payment.service';
import { OrderTransactionData } from '@/lib/types/payment.types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderPaymentInfo from './components/OrderPaymentInfo';
import OrderSummary from './components/OrderSummary';
import TransactionList from './components/TransactionList';
import { ExclamationTriangleIcon, CheckCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface OrderPaymentPageProps {
  orderId: string;
}

export default function OrderPaymentPage({ orderId }: OrderPaymentPageProps) {
  const [transactionData, setTransactionData] = useState<OrderTransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrderData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await paymentService.getOrderTransaction(orderId);
      setTransactionData(data);
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
    if (!transactionData || transactionData.transaction.status === 'completed') return;

    const interval = setInterval(async () => {
      try {
        const data = await paymentService.getOrderTransaction(orderId);
        if (data.transaction.status === 'completed') {
          setTransactionData(data);
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [transactionData, orderId]);

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

  if (error || !transactionData) {
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
  if (transactionData.transaction.status === 'completed') {
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
                <span className="font-mono font-bold text-gray-900">{transactionData.order.order_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số tiền đã thanh toán</span>
                <span className="font-bold text-[#F5A623]">
                  {new Intl.NumberFormat('vi-VN').format(transactionData.transaction.amount)} ₫
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Loại thanh toán</span>
                <span className="font-medium text-gray-900">
                  {transactionData.transaction.transaction_type === 'deposit' ? 'Đặt cọc' : 
                   transactionData.transaction.transaction_type === 'remaining' ? 'Còn lại' : 'Thanh toán đầy đủ'}
                </span>
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
            <p className="text-gray-600">
              Mã đơn hàng: <span className="font-mono font-bold text-[#F5A623]">{transactionData.order.order_code}</span>
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mt-2">
              <ShieldCheckIcon className="w-5 h-5 text-green-500" />
              <span>Thông tin được bảo mật an toàn 100%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Order Summary & Transactions */}
            <div className="lg:col-span-5 space-y-6">
              <OrderSummary 
                order={transactionData.order}
                campaign={transactionData.campaign}
                currentTransaction={transactionData.transaction}
              />
              
              <TransactionList 
                transactions={transactionData.all_transactions}
                currentTransactionId={transactionData.transaction.id}
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

            {/* Right Column: Payment Info */}
            <div className="lg:col-span-7">
              <OrderPaymentInfo 
                paymentInfo={transactionData.payment_info}
                amount={transactionData.transaction.amount}
                transactionType={transactionData.transaction.transaction_type}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
