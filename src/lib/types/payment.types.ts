// Payment and Campaign related types

export interface StudentGroup {
  id: string;
  name: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  student_group: StudentGroup;
  status: string;
  original_price: number;
  km01_price: number;
  km02_price: number;
  km03_price: number;
  campaign_url: string;
  campaign_token: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  errorCode: string;
  token: string;
  campaign: Campaign;
  selected_promotion: string;
  promotion_amount: number;
  is_deposit: boolean;
  deposit_amount: number;
  final_amount: number;
  is_expired: boolean;
  expires_at: string;
}
