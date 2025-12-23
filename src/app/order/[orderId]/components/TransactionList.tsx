'use client';

import { OrderTransaction } from '@/lib/types/payment.types';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface TransactionListProps {
  transactions: OrderTransaction[];
  currentTransactionId: string;
}

export default function TransactionList({ transactions, currentTransactionId }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Đặt cọc';
      case 'remaining':
        return 'Còn lại';
      case 'full':
        return 'Đầy đủ';
      default:
        return type;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'failed':
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Hoàn thành', color: 'text-green-600' };
      case 'pending':
        return { label: 'Đang chờ', color: 'text-yellow-600' };
      case 'failed':
        return { label: 'Thất bại', color: 'text-red-600' };
      case 'cancelled':
        return { label: 'Đã hủy', color: 'text-red-600' };
      default:
        return { label: status, color: 'text-gray-600' };
    }
  };

  if (transactions.length <= 1) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Danh sách giao dịch</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {transactions.map((transaction) => {
          const status = getStatusLabel(transaction.status);
          const isCurrent = transaction.id === currentTransactionId;

          return (
            <div 
              key={transaction.id} 
              className={`p-4 flex items-center justify-between ${isCurrent ? 'bg-orange-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(transaction.status)}
                <div>
                  <p className="font-medium text-gray-900">
                    {getTransactionTypeLabel(transaction.transaction_type)}
                    {isCurrent && (
                      <span className="ml-2 text-xs bg-[#F5A623] text-white px-2 py-0.5 rounded-full">
                        Hiện tại
                      </span>
                    )}
                  </p>
                  <p className={`text-sm ${status.color}`}>{status.label}</p>
                </div>
              </div>
              <p className="font-bold text-gray-900">{formatCurrency(transaction.amount)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
