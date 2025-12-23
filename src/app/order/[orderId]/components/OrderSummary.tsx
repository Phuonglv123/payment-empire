'use client';

import { OrderInfo, OrderCampaign, OrderTransaction } from '@/lib/types/payment.types';

interface OrderSummaryProps {
  order: OrderInfo;
  campaign: OrderCampaign;
  currentTransaction: OrderTransaction;
}

export default function OrderSummary({ order, campaign, currentTransaction }: OrderSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Đặt cọc';
      case 'remaining':
        return 'Thanh toán còn lại';
      case 'full':
        return 'Thanh toán đầy đủ';
      default:
        return type;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'unpaid':
        return { label: 'Chưa thanh toán', color: 'text-red-600 bg-red-50' };
      case 'partial':
        return { label: 'Thanh toán một phần', color: 'text-yellow-600 bg-yellow-50' };
      case 'paid':
        return { label: 'Đã thanh toán', color: 'text-green-600 bg-green-50' };
      default:
        return { label: status, color: 'text-gray-600 bg-gray-50' };
    }
  };

  const paymentStatus = getPaymentStatusLabel(order.payment_status);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
        <h2 className="text-white font-bold text-lg mb-1">Thông tin đơn hàng</h2>
        <p className="text-gray-300 text-sm">{campaign.name}</p>
      </div>

      <div className="p-6 space-y-4">
        {/* Customer Info */}
        <div className="pb-4 border-b border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Khách hàng</p>
          <p className="text-gray-900 font-medium">{order.customer_name}</p>
        </div>

        {/* Order Status */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <span className="text-gray-600">Trạng thái thanh toán</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatus.color}`}>
            {paymentStatus.label}
          </span>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 pb-4 border-b border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tổng giá trị đơn hàng</span>
            <span className="text-gray-900 font-medium">{formatCurrency(order.total_amount)}</span>
          </div>
          
          {order.deposit_amount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Số tiền đặt cọc</span>
              <span className="text-gray-900 font-medium">{formatCurrency(order.deposit_amount)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Đã thanh toán</span>
            <span className="text-green-600 font-medium">{formatCurrency(order.paid_amount)}</span>
          </div>

          {order.remaining_amount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Còn lại</span>
              <span className="text-orange-600 font-medium">{formatCurrency(order.remaining_amount)}</span>
            </div>
          )}
        </div>

        {/* Current Transaction */}
        <div className="bg-[#FFF8E7] rounded-xl p-4">
          <p className="text-xs text-[#B8860B] uppercase font-semibold tracking-wider mb-2">
            Giao dịch hiện tại
          </p>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">
              {getTransactionTypeLabel(currentTransaction.transaction_type)}
            </span>
            <span className="text-2xl font-bold text-[#F5A623]">
              {formatCurrency(currentTransaction.amount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
