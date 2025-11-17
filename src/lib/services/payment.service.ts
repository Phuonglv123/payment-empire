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
    customerInfo: CustomerInfo,
    paymentType: 'deposit' | 'full' = 'deposit',
    promotionCode?: string
  ): Promise<PaymentOrder> => {
    const requestBody = {
      campaign_id: campaignId,
      customer_name: customerInfo.fullName,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phoneNumber,
      customer_address: customerInfo.address,
      address_level_1: customerInfo.addressLevel1 || '',
      address_level_2: customerInfo.addressLevel2 || '',
      billing_address: customerInfo.billingAddress || customerInfo.address,
      payment_type: paymentType,
      promotion_code: promotionCode || '',
      notes: customerInfo.notes || '',
    };
    
    const response = await api.post<PaymentOrder>('/public/orders', requestBody);
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
