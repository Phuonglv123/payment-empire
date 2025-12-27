import { api } from '@/lib/axios';
import {
  PaymentLinkData,
  PublicOrder,
  ApiResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  VietQRPaymentInfo,
  PaymentStatusResponse,
  PaymentConfirmRequest,
} from '@/lib/types/payment.types';

/**
 * Payment Service
 * Handles all payment-related API calls for the public payment site
 * Using VietQR for payment processing
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
   * Returns payment_info with VietQR code for payment
   * @param orderData - Order creation data including token and customer info
   * @returns Order response with payment_info containing VietQR data
   */
  createOrder: async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await api.post<CreateOrderResponse>(
      '/public/orders',
      orderData
    );
    
    if (response.data.errorCode !== 'SUCCESS' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create order');
    }
    
    return response.data;
  },

  /**
   * Get payment info by payment ID
   * @param paymentId - The payment ID
   * @returns VietQR payment information
   */
  getPaymentInfo: async (paymentId: string): Promise<VietQRPaymentInfo> => {
    const response = await api.get<VietQRPaymentInfo>(
      `/public/payments/${paymentId}`
    );
    
    return response.data;
  },

  /**
   * Get payment info by order ID
   * @param orderId - The order ID
   * @returns VietQR payment information
   */
  getPaymentByOrderId: async (orderId: string): Promise<VietQRPaymentInfo> => {
    const response = await api.get<VietQRPaymentInfo>(
      `/public/orders/${orderId}/payment`
    );
    
    return response.data;
  },

  /**
   * Check payment status
   * @param paymentId - The payment ID
   * @returns Payment status information
   */
  checkPaymentStatus: async (paymentId: string): Promise<PaymentStatusResponse> => {
    const response = await api.get<PaymentStatusResponse>(
      `/public/payments/${paymentId}/status`
    );
    
    return response.data;
  },

  /**
   * Confirm payment (customer self-report)
   * @param paymentId - The payment ID
   * @param data - Optional proof image and note
   * @returns Success message
   */
  confirmPayment: async (paymentId: string, data?: PaymentConfirmRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      `/public/payments/${paymentId}/confirm`,
      data || {}
    );
    
    return response.data;
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
};
