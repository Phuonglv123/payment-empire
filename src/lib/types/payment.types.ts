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
  used_quantity?: number;
  max_quantity?: number;
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
  address_level_1?: string; // Invoice Address (JSON)
  address_level_2?: string; // Shipping Address (JSON)
  student_group?: string;
  notes?: string;
  campaign_id: string;
  payment_channel?: string;
  promotion_code?: string;
}

// Virtual Account info returned from backend
export interface VirtualAccount {
  id: string;
  account_number: string;
  reference_number: string;
  name: string;
  pay_type: string;
  max_amount: number;
  min_amount: number;
  equal_amount: number;
  detail1: string;
  detail2: string;
  detail3: string;
  email: string;
  phone: string;
  expiry_date: string;
  status: string;
  order_id: string;
  qr_code: string;
  created_at: string;
  updated_at: string;
}

export interface ManualPaymentInfo {
  bank_name: string;
  account_number: string;
  account_holder: string;
  bin: string;
  amount: number;
  description: string;
  qr_code_url: string;
}

// Public Order response from backend
export interface PublicOrder {
  id: string;
  order_code: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  customer_address?: string;
  quantity: number;
  unit_price: number;
  original_amount: number;
  total_amount: number;
  order_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_type: 'full' | 'deposit';
  invoice_status: 'not_issued' | 'issued' | 'sent';
  confirmation_status: 'not_sent' | 'sent';
  campaign_id: string;
  campaign: Campaign;
  notes?: string;
  virtual_account?: VirtualAccount;
  payment_info?: ManualPaymentInfo;
  payment_channel?: string;
  created_at: string;
  updated_at: string;
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
  errorCode: string;
  token: string;
  campaign: Campaign;
  selected_promotion: 'km01' | 'km02' | 'km03';
  promotion_amount: number;
  is_deposit: boolean;
  deposit_amount: number;
  final_amount: number;
  is_expired: boolean;
  expires_at: string;
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
