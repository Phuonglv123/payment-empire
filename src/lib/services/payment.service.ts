import { api } from '@/lib/axios';
import {
  PaymentLinkData,
  Campaign,
  CustomerInfo,
  PaymentOrder,
  QRCodeResponse,
} from '@/lib/types/payment.types';

/**
 * Payment Service
 * Handles all payment-related API calls
 */
export const paymentService = {
  /**
   * Get payment link data by link ID
   */
  getPaymentLink: async (linkId: string): Promise<PaymentLinkData> => {
    const response = await api.get<PaymentLinkData>(
      `/public/payment-links/${linkId}`
    );
    return response.data;
  },

  /**
   * Get campaign details
   */
  getCampaign: async (campaignId: string): Promise<Campaign> => {
    const response = await api.get<Campaign>(`/campaigns/${campaignId}`);
    return response.data;
  },

  /**
   * Create a payment order
   */
  createOrder: async (
    campaignId: string,
    customerInfo: CustomerInfo
  ): Promise<PaymentOrder> => {
    const response = await api.post<PaymentOrder>('/orders', {
      campaignId,
      customerInfo,
    });
    return response.data;
  },

  /**
   * Generate QR code for payment
   */
  generateQRCode: async (
    orderId: string,
    bankCode: string
  ): Promise<QRCodeResponse> => {
    const response = await api.post<QRCodeResponse>('/payments/generate-qr', {
      orderId,
      bankCode,
    });
    return response.data;
  },

  /**
   * Check order status
   */
  checkOrderStatus: async (orderId: string): Promise<PaymentOrder> => {
    const response = await api.get<PaymentOrder>(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Update order status (used by webhook)
   */
  updateOrderStatus: async (
    orderId: string,
    status: PaymentOrder['status'],
    transactionId?: string
  ): Promise<PaymentOrder> => {
    const response = await api.patch<PaymentOrder>(`/orders/${orderId}/status`, {
      status,
      transactionId,
    });
    return response.data;
  },
};
