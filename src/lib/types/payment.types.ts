// Payment and Campaign related types

export interface Campaign {
  id: string;
  name: string;
  description: string;
  product: string;
  imageUrl: string;
  originalPrice: number;
  discount1?: number; // Discount percentage
  discount2?: number; // Additional discount percentage
  discount3?: number; // Additional discount percentage
  finalPrice: number;
  bankCode: string; // Default: 'MSB'
  groupId?: string; // Group to add user to after payment
}

export interface CustomerInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export interface PaymentOrder {
  id: string;
  campaignId: string;
  customerInfo: CustomerInfo;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  paymentMethod: string;
  qrCodeUrl?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QRCodeResponse {
  qrCodeUrl: string;
  qrCodeData: string;
  transactionId: string;
  expiresAt: string;
}

export interface WebhookPayload {
  transactionId: string;
  orderId: string;
  amount: number;
  status: 'success' | 'failed';
  timestamp: string;
  bankCode: string;
}

export interface CreateUserResponse {
  userId: string;
  username: string;
  password: string;
  email: string;
}

export interface PaymentLinkData {
  linkId: string;
  campaign: Campaign;
  isValid: boolean;
  expiresAt?: string;
}
