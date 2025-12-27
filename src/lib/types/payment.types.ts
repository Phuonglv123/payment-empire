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
  payment_link_token?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  address_level_1?: string; // Invoice Address (JSON)
  address_level_2?: string; // Shipping Address (JSON)
  student_group?: string;
  notes?: string;
  campaign_id: string;
  promotion_code?: string;
}

// VietQR Payment Info - Thông tin thanh toán VietQR
export interface VietQRPaymentInfo {
  payment_id: string;
  order_id: string;
  order_code: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  bank_code: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  description: string;
  qr_code_url: string;
  vietqr_link: string;
  expires_at: string;
  created_at: string;
}

// Payment Status types
export type PaymentStatus = 'pending' | 'confirmed' | 'completed' | 'expired' | 'cancelled';

// Payment Status Response
export interface PaymentStatusResponse {
  payment_id: string;
  order_code: string;
  status: PaymentStatus;
  amount: number;
  payment_date: string | null;
  confirmed_at: string | null;
}

// Payment Confirm Request
export interface PaymentConfirmRequest {
  payment_proof_image?: string;
  note?: string;
}

// Legacy interfaces for backward compatibility
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
  paid_amount: number;
  order_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_type: 'full' | 'deposit';
  invoice_status: 'not_issued' | 'issued' | 'sent';
  confirmation_status: 'not_sent' | 'sent';
  campaign_id: string;
  campaign: Campaign;
  notes?: string;
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

// Create Order Response with VietQR payment info
export interface CreateOrderResponse {
  errorCode: string;
  message: string;
  data: PublicOrder;
  payment_info: VietQRPaymentInfo;
}
