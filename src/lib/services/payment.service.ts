import { api } from '@/lib/axios';
import {
  PaymentLinkData,
  PublicOrder,
  ApiResponse,
  CreateOrderRequest,
  OrderTransactionData,
} from '@/lib/types/payment.types';

/**
 * Payment Service
 * Handles all payment-related API calls for the public payment site
 */
export const paymentService = {
  /**
   * Get payment link data by token
   * @param token - The payment link token from URL
   * @returns Payment link data including campaign info, pricing, etc.
   */
  getPaymentLink: async (token: string): Promise<PaymentLinkData> => {
    const response = await api.get<ApiResponse<PaymentLinkData>>(
      `/public/payment-links/${token}`
    );
    
    if (response.data.errorCode !== 'SUCCESS' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to load payment link');
    }
    
    return response.data.data;
  },

  /**
   * Create a public order with customer information
   * Backend automatically creates Virtual Account and returns it in the response
   * @param orderData - Order creation data including token and customer info
   * @returns Order details with virtual account information
   */
  createOrder: async (orderData: CreateOrderRequest): Promise<PublicOrder> => {
    const response = await api.post<ApiResponse<PublicOrder>>(
      '/public/orders',
      orderData
    );
    
    if (response.data.errorCode !== 'SUCCESS' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create order');
    }
    
    return response.data.data;
  },

  /**
   * Check order status (for polling payment status)
   * @param orderId - The order ID
   * @returns Order with current status
   */
  checkOrderStatus: async (orderId: string): Promise<PublicOrder> => {
    const response = await api.get<ApiResponse<PublicOrder>>(
      `/public/orders/${orderId}/status`
    );
    
    if (response.data.errorCode !== 'SUCCESS' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to check order status');
    }
    
    return response.data.data;
  },

  /**
   * Get order transaction data for direct payment
   * @param orderId - The order ID
   * @returns Order transaction data including payment info
   */
  getOrderTransaction: async (orderId: string): Promise<OrderTransactionData> => {
    const response = await api.get<ApiResponse<OrderTransactionData>>(
      `/public/orders/${orderId}/transactions`
    );
    
    if (response.data.errorCode !== 'SUCCESS' || !response.data.data) {
      throw new Error(response.data.message || 'Không tìm thấy thông tin đơn hàng');
    }
    
    return response.data.data;
  },
};
