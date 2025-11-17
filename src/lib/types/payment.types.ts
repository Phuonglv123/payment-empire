// Payment and Campaign related types

export interface StudentGroup {
  id: string;
  name: string;
}

// Campaign structure from backend
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  student_group?: StudentGroup;
  status?: string;
  original_price?: number;
  km01_price?: number;
  km02_price?: number;
  km03_price?: number;
  campaign_url?: string;
  campaign_token?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Collaborator info from payment link
export interface Collaborator {
  id: string;
  full_name: string;
  phone: string;
}

export interface CustomerInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  addressLevel1?: string;
  addressLevel2?: string;
  billingAddress?: string;
  notes?: string;
}

// Request body for creating order via public API
export interface CreateOrderRequest {
  payment_link_token: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  student_group?: string;
  notes?: string;
}

// Virtual Account info returned from backend
export interface VirtualAccount {
  id: string;
  account_number: string;
  bank_name: string;
  account_name: string;
  amount: number;
  qr_code: string; // Base64 encoded QR code image
  expiry_date: string; // ISO 8601 format
  status: 'active' | 'paid' | 'expired';
  created_at: string;
}

// Public Order response from backend
export interface PublicOrder {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  total_amount: number;
  order_status: 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  student_group?: string;
  notes?: string;
  created_at: string;
  campaign: {
    id: string;
    name: string;
  };
  virtual_account?: VirtualAccount;
}

// Legacy PaymentOrder interface (kept for backward compatibility)
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

// Payment Link data structure from backend
export interface PaymentLinkData {
  id: string;
  token: string;
  campaign: Campaign;
  collaborator?: Collaborator;
  product_name: string;
  base_price: number;
  discount_percent: number;
  final_price: number;
  max_uses: number;
  current_uses: number;
  expires_at: string;
  is_active: boolean;
  notes?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  errorCode: string;
  data?: T;
  message?: string;
}

// Legacy PaymentLinkData (kept for backward compatibility)
export interface LegacyPaymentLinkData {
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
