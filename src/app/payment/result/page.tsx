'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

function PaymentResultContent() {
  const searchParams = useSearchParams();
  
  const status = searchParams.get('status');
  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');

  const isSuccess = status === 'success';
  const isPending = status === 'pending';
  const isFailed = status === 'failed' || (!isSuccess && !isPending);

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
        {isSuccess && (
          <>
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã thanh toán. Thông tin đơn hàng đã được gửi đến email của bạn.
            </p>
            {orderId && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã đơn hàng</span>
                  <span className="font-mono font-bold text-gray-900">{orderId}</span>
                </div>
              </div>
            )}
            <a 
              href="/"
              className="w-full inline-block bg-[#F5A623] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#E09612] transition-colors shadow-lg shadow-orange-200"
            >
              Về trang chủ
            </a>
          </>
        )}

        {isPending && (
          <>
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClockIcon className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang xử lý thanh toán</h2>
            <p className="text-gray-600 mb-6">
              Thanh toán của bạn đang được xử lý. Vui lòng đợi trong giây lát hoặc kiểm tra email để biết kết quả.
            </p>
            {orderId && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã đơn hàng</span>
                  <span className="font-mono font-bold text-gray-900">{orderId}</span>
                </div>
              </div>
            )}
            <a 
              href="/"
              className="w-full inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Về trang chủ
            </a>
          </>
        )}

        {isFailed && (
          <>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircleIcon className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thất bại</h2>
            <p className="text-gray-600 mb-6">
              Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </p>
            {orderId && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã đơn hàng</span>
                  <span className="font-mono font-bold text-gray-900">{orderId}</span>
                </div>
              </div>
            )}
            <div className="space-y-3">
              <a 
                href="/"
                className="w-full inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Về trang chủ
              </a>
              <p className="text-sm text-gray-500">
                Nếu cần hỗ trợ, vui lòng liên hệ: <a href="tel:0901234567" className="text-[#F5A623] font-medium">0901234567</a>
              </p>
            </div>
          </>
        )}

        {sessionId && (
          <p className="text-xs text-gray-400 mt-4">
            Session ID: {sessionId}
          </p>
        )}
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5A623] mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Đang tải...</p>
          </div>
        </div>
      }>
        <PaymentResultContent />
      </Suspense>
      <Footer />
    </div>
  );
}
