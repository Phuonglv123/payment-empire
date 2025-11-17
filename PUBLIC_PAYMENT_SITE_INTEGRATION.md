# Public Payment Site - Frontend Integration Guide

**Version:** 2.0.0  
**Last Updated:** November 17, 2025  
**For:** Public Site Frontend Developers

> ⚠️ **Note**: Tài liệu này dành cho **Public Payment Site** (học viên đăng ký và thanh toán).  
> Nếu bạn đang tích hợp **CRM Admin Site**, vui lòng xem: [MSB_VA_FRONTEND_INTEGRATION.md](./MSB_VA_FRONTEND_INTEGRATION.md)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [User Flow](#user-flow)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [UI/UX Guidelines](#uiux-guidelines)
6. [Code Examples](#code-examples)
7. [Payment Display](#payment-display)
8. [Error Handling](#error-handling)
9. [Testing](#testing)

---

## Overview

### What is Public Payment Site?

**Public Payment Site** là trang web công khai cho phép học viên:
- 📧 Nhận link payment link qua email/SMS
- 📝 Nhập thông tin cá nhân
- 🛒 Tạo đơn hàng
- 💳 Nhận thông tin thanh toán (Virtual Account)
- ✅ Thanh toán qua chuyển khoản

### Key Features

- ✅ **NO Authentication Required** - Không cần đăng nhập
- ✅ **Token-based Access** - Truy cập qua payment link token
- ✅ **Simple Flow** - Chỉ 3 bước: Nhập info → Tạo order → Thanh toán
- ✅ **Auto VA Creation** - Virtual Account tự động tạo khi order thành công
- ✅ **QR Code Payment** - Hỗ trợ quét mã QR để thanh toán nhanh

### Base URL

```
Production: https://payment.crm-empire.com
Development: http://localhost:3000
```

**Backend API:**
```
Production: https://api.crm-empire.com/api/v1
Development: http://localhost:8080/api/v1
```

---

## User Flow

### Complete User Journey

```
1. Học viên nhận email/SMS
   ↓
   [Email contains: https://payment.crm-empire.com?token=abc123xyz]
   
2. Click vào link → Mở Public Payment Site
   ↓
   
3. Site load thông tin từ Payment Link
   ↓
   GET /api/v1/public/payment-links/{token}
   ↓
   Hiển thị form với:
   - Campaign name (readonly)
   - Product/Service info (readonly)
   - Price (readonly)
   - Input fields: Name, Phone, Email, Address, etc.
   
4. Học viên nhập thông tin và submit
   ↓
   POST /api/v1/public/orders
   {
     "payment_link_token": "abc123xyz",
     "customer_name": "Nguyễn Văn A",
     "customer_phone": "0912345678",
     ...
   }
   ↓
   
5. Backend tự động:
   - Tạo Order
   - Tạo Virtual Account
   - Trả về thông tin đầy đủ
   
6. Site hiển thị Payment Information
   ↓
   - Số tài khoản VA
   - Số tiền cần thanh toán
   - QR Code
   - Hướng dẫn thanh toán
   
7. Học viên thanh toán qua ngân hàng
   ↓
   
8. Webhook từ MSB → Backend cập nhật trạng thái
   ↓
   
9. Site hiển thị "Thanh toán thành công"
```

---

## API Endpoints

### 1. Get Payment Link Info

Lấy thông tin payment link để hiển thị cho học viên.

**Endpoint:** `GET /api/v1/public/payment-links/{token}`

**Path Parameters:**
- `token` (string, required): Token từ URL mà học viên nhận được

**No Authentication Required** ✅

**Example Request:**

```bash
curl -X GET 'http://localhost:8080/api/v1/public/payment-links/abc123xyz' \
  -H 'Accept: application/json'
```

**Success Response (200):**

```json
{
  "errorCode": "SUCCESS",
  "data": {
    "id": "uuid-of-payment-link",
    "token": "abc123xyz",
    "campaign": {
      "id": "campaign-uuid",
      "name": "Khóa học lập trình Full Stack 2025",
      "description": "Khóa học 6 tháng với mentor 1-1"
    },
    "collaborator": {
      "id": "collab-uuid",
      "full_name": "Nguyễn Thị B",
      "phone": "0987654321"
    },
    "product_name": "Full Stack Development Course",
    "base_price": 15000000,
    "discount_percent": 10,
    "final_price": 13500000,
    "max_uses": 10,
    "current_uses": 3,
    "expires_at": "2025-12-31T23:59:59Z",
    "is_active": true,
    "notes": "Ưu đãi đặc biệt cho học viên đăng ký sớm"
  }
}
```

**Error Responses:**

```json
// 404 - Token không tồn tại hoặc đã hết hạn
{
  "errorCode": "NOT_FOUND",
  "message": "Payment link not found or expired"
}

// 403 - Payment link đã hết số lần sử dụng
{
  "errorCode": "FORBIDDEN",
  "message": "Payment link has reached maximum uses"
}

// 403 - Payment link không còn hoạt động
{
  "errorCode": "FORBIDDEN",
  "message": "Payment link is no longer active"
}
```

---

### 2. Create Public Order

Tạo đơn hàng cho học viên. Backend sẽ **tự động tạo Virtual Account** và trả về trong response.

**Endpoint:** `POST /api/v1/public/orders`

**No Authentication Required** ✅

**Request Body:**

```json
{
  "payment_link_token": "abc123xyz",
  "customer_name": "Nguyễn Văn A",
  "customer_phone": "0912345678",
  "customer_email": "nguyenvana@example.com",
  "customer_address": "123 Nguyễn Huệ, Q1, TPHCM",
  "student_group": "Nhóm học Full Stack K15",
  "notes": "Muốn học vào buổi tối"
}
```

**Required Fields:**
- `payment_link_token` (string): Token từ URL
- `customer_name` (string): Tên học viên
- `customer_phone` (string): Số điện thoại

**Optional Fields:**
- `customer_email` (string): Email
- `customer_address` (string): Địa chỉ
- `student_group` (string): Nhóm học hoặc ghi chú
- `notes` (string): Ghi chú thêm

**Success Response (200):**

```json
{
  "errorCode": "SUCCESS",
  "data": {
    "id": "order-uuid",
    "order_code": "ORD-20251117-0001",
    "customer_name": "Nguyễn Văn A",
    "customer_phone": "0912345678",
    "customer_email": "nguyenvana@example.com",
    "customer_address": "123 Nguyễn Huệ, Q1, TPHCM",
    "total_amount": 13500000,
    "order_status": "confirmed",
    "payment_status": "unpaid",
    "student_group": "Nhóm học Full Stack K15",
    "notes": "Muốn học vào buổi tối",
    "created_at": "2025-11-17T10:30:00Z",
    "campaign": {
      "id": "campaign-uuid",
      "name": "Khóa học lập trình Full Stack 2025"
    },
    "virtual_account": {
      "id": "va-uuid",
      "account_number": "9686680000000123",
      "bank_name": "MSB",
      "account_name": "CONG TY EMPIRE",
      "amount": 13500000,
      "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANS...",
      "expiry_date": "2025-11-24T23:59:59Z",
      "status": "active",
      "created_at": "2025-11-17T10:30:01Z"
    }
  }
}
```

**Key Point:** 🎯 Response đã bao gồm `virtual_account` - không cần gọi thêm API!

**Error Responses:**

```json
// 400 - Thiếu thông tin bắt buộc
{
  "errorCode": "BAD_REQUEST",
  "message": "customer_name and customer_phone are required"
}

// 404 - Payment link không tồn tại
{
  "errorCode": "NOT_FOUND",
  "message": "Payment link not found"
}

// 403 - Payment link đã hết hạn hoặc hết lượt
{
  "errorCode": "FORBIDDEN",
  "message": "Payment link is no longer valid"
}

// 500 - Lỗi tạo Virtual Account
{
  "errorCode": "INTERNAL_ERROR",
  "message": "Failed to create virtual account"
}
```

---

## Data Models

### Payment Link Object

```typescript
interface PaymentLink {
  id: string;
  token: string;                    // Token trong URL
  campaign: {
    id: string;
    name: string;
    description?: string;
  };
  collaborator?: {
    id: string;
    full_name: string;
    phone: string;
  };
  product_name: string;
  base_price: number;               // Giá gốc (VND)
  discount_percent: number;         // % giảm giá (0-100)
  final_price: number;              // Giá cuối sau giảm
  max_uses: number;                 // Số lần tối đa
  current_uses: number;             // Đã dùng bao nhiêu lần
  expires_at: string;               // Ngày hết hạn (ISO 8601)
  is_active: boolean;               // Còn active không
  notes?: string;                   // Ghi chú
}
```

### Public Order Object

```typescript
interface PublicOrder {
  id: string;
  order_code: string;               // Mã đơn hàng (VD: ORD-20251117-0001)
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  total_amount: number;             // Số tiền (VND)
  order_status: 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  student_group?: string;
  notes?: string;
  created_at: string;               // ISO 8601
  campaign: {
    id: string;
    name: string;
  };
  virtual_account?: VirtualAccount; // ⭐ Thông tin VA tự động có sẵn
}
```

### Virtual Account Object

```typescript
interface VirtualAccount {
  id: string;
  account_number: string;           // Số tài khoản VA (19 chữ số)
  bank_name: string;                // "MSB"
  account_name: string;             // Tên tài khoản nhận
  amount: number;                   // Số tiền cần thanh toán
  qr_code: string;                  // Base64 QR code image
  expiry_date: string;              // Hết hạn sau 7 ngày (ISO 8601)
  status: 'active' | 'paid' | 'expired';
  created_at: string;               // ISO 8601
}
```

---

## UI/UX Guidelines

### Page Structure

#### 1. Landing Page (Load từ token)

```
╔═══════════════════════════════════════════════════╗
║                   🎓 EMPIRE EDUCATION             ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  📚 Khóa học lập trình Full Stack 2025           ║
║                                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                   ║
║  Thông tin khóa học:                             ║
║  • Thời gian: 6 tháng                            ║
║  • Mentor: 1-1 support                           ║
║  • Certificate: Có                               ║
║                                                   ║
║  💰 Giá: 15.000.000đ                             ║
║     Giảm: 10% → 13.500.000đ                      ║
║                                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                   ║
║  👤 Thông tin của bạn:                           ║
║                                                   ║
║  Họ và tên *                                     ║
║  ┌─────────────────────────────────────────┐    ║
║  │ Nhập họ và tên đầy đủ                   │    ║
║  └─────────────────────────────────────────┘    ║
║                                                   ║
║  Số điện thoại *                                 ║
║  ┌─────────────────────────────────────────┐    ║
║  │ 0912345678                               │    ║
║  └─────────────────────────────────────────┘    ║
║                                                   ║
║  Email                                           ║
║  ┌─────────────────────────────────────────┐    ║
║  │ email@example.com                        │    ║
║  └─────────────────────────────────────────┘    ║
║                                                   ║
║  Địa chỉ                                         ║
║  ┌─────────────────────────────────────────┐    ║
║  │                                          │    ║
║  └─────────────────────────────────────────┘    ║
║                                                   ║
║  Nhóm học/Ghi chú                                ║
║  ┌─────────────────────────────────────────┐    ║
║  │                                          │    ║
║  └─────────────────────────────────────────┘    ║
║                                                   ║
║     [ ĐĂNG KÝ VÀ THANH TOÁN ]                   ║
║                                                   ║
║  Bằng việc đăng ký, bạn đồng ý với điều khoản   ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

#### 2. Payment Information Page (Sau khi tạo order thành công)

```
╔═══════════════════════════════════════════════════╗
║            ✅ Đăng ký thành công!                 ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  Mã đơn hàng: ORD-20251117-0001                  ║
║                                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                   ║
║  💳 THÔNG TIN THANH TOÁN                         ║
║                                                   ║
║  🏦 Ngân hàng:                                    ║
║      MSB - Ngân hàng TMCP Hàng Hải Việt Nam      ║
║                                                   ║
║  👤 Chủ tài khoản:                               ║
║      CONG TY EMPIRE                              ║
║                                                   ║
║  💰 Số tiền:                                     ║
║      13.500.000 VND                   [Copy]     ║
║                                                   ║
║  🔢 Số tài khoản:                                ║
║      9686680000000123                 [Copy]     ║
║                                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                   ║
║  📱 Quét mã QR để thanh toán nhanh:              ║
║                                                   ║
║      ┌───────────────────────┐                   ║
║      │                       │                   ║
║      │     [QR CODE]         │                   ║
║      │                       │                   ║
║      └───────────────────────┘                   ║
║                                                   ║
║      [Tải mã QR]                                 ║
║                                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                   ║
║  ⏰ Vui lòng thanh toán trong: 6 ngày 23:45:12   ║
║                                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                   ║
║  📌 Lưu ý:                                       ║
║  • Chuyển khoản ĐÚNG số tiền: 13.500.000 VND    ║
║  • Không cần ghi nội dung chuyển khoản          ║
║  • Sau khi chuyển khoản, đơn hàng tự động cập   ║
║    nhật trong vài phút                           ║
║                                                   ║
║  [ Hướng dẫn thanh toán ]  [ Kiểm tra TT ]      ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

#### 3. Payment Success Page

```
╔═══════════════════════════════════════════════════╗
║                  🎉 Thành công!                   ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  ✅ Đã nhận được thanh toán của bạn               ║
║                                                   ║
║  Mã đơn hàng: ORD-20251117-0001                  ║
║  Số tiền: 13.500.000 VND                         ║
║  Thời gian: 17/11/2025 14:30                     ║
║                                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                   ║
║  📧 Chúng tôi đã gửi email xác nhận đến:         ║
║     nguyenvana@example.com                       ║
║                                                   ║
║  📞 Bộ phận tư vấn sẽ liên hệ bạn trong 24h      ║
║                                                   ║
║  [ Về trang chủ ]                                ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

---

## Code Examples

### React/TypeScript Implementation

#### 1. Main App Component

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaymentLinkPage from './pages/PaymentLinkPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaymentLinkPage />} />
        <Route path="/success/:orderId" element={<PaymentSuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

#### 2. Payment Link Page

```typescript
// pages/PaymentLinkPage.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentLinkInfo from '../components/PaymentLinkInfo';
import OrderForm from '../components/OrderForm';
import PaymentInfo from '../components/PaymentInfo';
import ErrorMessage from '../components/ErrorMessage';

const API_BASE = 'http://localhost:8080/api/v1';

interface PaymentLink {
  id: string;
  token: string;
  campaign: {
    id: string;
    name: string;
    description?: string;
  };
  product_name: string;
  base_price: number;
  discount_percent: number;
  final_price: number;
  expires_at: string;
  notes?: string;
}

interface Order {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  total_amount: number;
  virtual_account?: {
    account_number: string;
    bank_name: string;
    account_name: string;
    amount: number;
    qr_code: string;
    expiry_date: string;
  };
}

export default function PaymentLinkPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Load payment link info
  useEffect(() => {
    if (!token) {
      setError('Link không hợp lệ. Vui lòng kiểm tra lại link bạn nhận được.');
      setLoading(false);
      return;
    }

    loadPaymentLink();
  }, [token]);

  const loadPaymentLink = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(
        `${API_BASE}/public/payment-links/${token}`
      );

      if (response.data.errorCode === 'SUCCESS') {
        setPaymentLink(response.data.data);
      } else {
        setError(response.data.message || 'Không thể tải thông tin payment link');
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Link không tồn tại hoặc đã hết hạn');
      } else if (err.response?.status === 403) {
        setError('Link này không còn hoạt động');
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOrder = async (formData: any) => {
    try {
      const response = await axios.post(`${API_BASE}/public/orders`, {
        payment_link_token: token,
        ...formData
      });

      if (response.data.errorCode === 'SUCCESS') {
        setCreatedOrder(response.data.data);
      } else {
        setError(response.data.message || 'Không thể tạo đơn hàng');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng'
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (createdOrder) {
    return <PaymentInfo order={createdOrder} />;
  }

  return (
    <div className="payment-link-page">
      {paymentLink && (
        <>
          <PaymentLinkInfo paymentLink={paymentLink} />
          <OrderForm
            paymentLink={paymentLink}
            onSubmit={handleSubmitOrder}
          />
        </>
      )}
    </div>
  );
}
```

#### 3. Order Form Component

```typescript
// components/OrderForm.tsx
import { useState } from 'react';

interface OrderFormProps {
  paymentLink: any;
  onSubmit: (data: any) => Promise<void>;
}

export default function OrderForm({ paymentLink, onSubmit }: OrderFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    student_group: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Vui lòng nhập họ tên';
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^0\d{9}$/.test(formData.customer_phone)) {
      newErrors.customer_phone = 'Số điện thoại không hợp lệ';
    }

    if (formData.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <h2>👤 Thông tin của bạn</h2>

      <div className="form-group">
        <label htmlFor="customer_name">
          Họ và tên <span className="required">*</span>
        </label>
        <input
          type="text"
          id="customer_name"
          name="customer_name"
          value={formData.customer_name}
          onChange={handleChange}
          placeholder="Nhập họ và tên đầy đủ"
          className={errors.customer_name ? 'error' : ''}
        />
        {errors.customer_name && (
          <span className="error-message">{errors.customer_name}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="customer_phone">
          Số điện thoại <span className="required">*</span>
        </label>
        <input
          type="tel"
          id="customer_phone"
          name="customer_phone"
          value={formData.customer_phone}
          onChange={handleChange}
          placeholder="0912345678"
          className={errors.customer_phone ? 'error' : ''}
        />
        {errors.customer_phone && (
          <span className="error-message">{errors.customer_phone}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="customer_email">Email</label>
        <input
          type="email"
          id="customer_email"
          name="customer_email"
          value={formData.customer_email}
          onChange={handleChange}
          placeholder="email@example.com"
          className={errors.customer_email ? 'error' : ''}
        />
        {errors.customer_email && (
          <span className="error-message">{errors.customer_email}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="customer_address">Địa chỉ</label>
        <input
          type="text"
          id="customer_address"
          name="customer_address"
          value={formData.customer_address}
          onChange={handleChange}
          placeholder="123 Nguyễn Huệ, Q1, TPHCM"
        />
      </div>

      <div className="form-group">
        <label htmlFor="student_group">Nhóm học/Ghi chú</label>
        <textarea
          id="student_group"
          name="student_group"
          value={formData.student_group}
          onChange={handleChange}
          placeholder="VD: Muốn học buổi tối, đã có kinh nghiệm HTML/CSS..."
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={submitting}
      >
        {submitting ? 'Đang xử lý...' : 'ĐĂNG KÝ VÀ THANH TOÁN'}
      </button>

      <p className="terms-text">
        Bằng việc đăng ký, bạn đồng ý với <a href="/terms">điều khoản sử dụng</a>
      </p>
    </form>
  );
}
```

#### 4. Payment Info Component

```typescript
// components/PaymentInfo.tsx
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface PaymentInfoProps {
  order: {
    id: string;
    order_code: string;
    customer_name: string;
    total_amount: number;
    virtual_account?: {
      account_number: string;
      bank_name: string;
      account_name: string;
      amount: number;
      qr_code: string;
      expiry_date: string;
    };
  };
}

export default function PaymentInfo({ order }: PaymentInfoProps) {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (!order.virtual_account?.expiry_date) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(order.virtual_account!.expiry_date).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeRemaining('Đã hết hạn');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${days} ngày ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [order.virtual_account?.expiry_date]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã copy ${label}!`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const downloadQR = () => {
    if (!order.virtual_account?.qr_code) return;

    const link = document.createElement('a');
    link.href = order.virtual_account.qr_code;
    link.download = `QR-${order.order_code}.png`;
    link.click();
  };

  if (!order.virtual_account) {
    return (
      <div className="payment-info">
        <h2>✅ Đăng ký thành công!</h2>
        <p>Mã đơn hàng: {order.order_code}</p>
        <p>Thông tin thanh toán sẽ được gửi qua email.</p>
      </div>
    );
  }

  const va = order.virtual_account;

  return (
    <div className="payment-info">
      <div className="success-header">
        <h1>✅ Đăng ký thành công!</h1>
        <p className="order-code">Mã đơn hàng: {order.order_code}</p>
      </div>

      <div className="payment-card">
        <h2>💳 THÔNG TIN THANH TOÁN</h2>

        <div className="info-row">
          <span className="label">🏦 Ngân hàng:</span>
          <span className="value">{va.bank_name} - Ngân hàng TMCP Hàng Hải Việt Nam</span>
        </div>

        <div className="info-row">
          <span className="label">👤 Chủ tài khoản:</span>
          <span className="value">{va.account_name}</span>
        </div>

        <div className="info-row copyable">
          <span className="label">💰 Số tiền:</span>
          <div className="value-with-copy">
            <span className="value amount">{formatCurrency(va.amount)}</span>
            <button
              className="copy-btn"
              onClick={() => copyToClipboard(va.amount.toString(), 'số tiền')}
            >
              📋 Copy
            </button>
          </div>
        </div>

        <div className="info-row copyable">
          <span className="label">🔢 Số tài khoản:</span>
          <div className="value-with-copy">
            <span className="value account-number">{va.account_number}</span>
            <button
              className="copy-btn"
              onClick={() => copyToClipboard(va.account_number, 'số tài khoản')}
            >
              📋 Copy
            </button>
          </div>
        </div>

        <div className="qr-section">
          <h3>📱 Quét mã QR để thanh toán nhanh:</h3>
          <div className="qr-container">
            <img src={va.qr_code} alt="QR Code" className="qr-code" />
          </div>
          <button className="download-qr-btn" onClick={downloadQR}>
            ⬇️ Tải mã QR
          </button>
        </div>

        <div className="timer-section">
          <p className="timer">
            ⏰ Vui lòng thanh toán trong: <strong>{timeRemaining}</strong>
          </p>
        </div>

        <div className="notes-section">
          <h3>📌 Lưu ý:</h3>
          <ul>
            <li>Chuyển khoản <strong>ĐÚNG số tiền</strong>: {formatCurrency(va.amount)}</li>
            <li>Không cần ghi nội dung chuyển khoản</li>
            <li>Sau khi chuyển khoản, đơn hàng tự động cập nhật trong vài phút</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button className="btn btn-secondary">
            📖 Hướng dẫn thanh toán
          </button>
          <button className="btn btn-primary">
            🔍 Kiểm tra trạng thái
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### 5. CSS Styling

```css
/* styles/payment-link.css */

/* General Layout */
.payment-link-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196F3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Order Form */
.order-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.order-form h2 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.form-group .required {
  color: #f44336;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2196F3;
}

.form-group input.error,
.form-group textarea.error {
  border-color: #f44336;
}

.error-message {
  display: block;
  margin-top: 5px;
  color: #f44336;
  font-size: 14px;
}

.submit-button {
  width: 100%;
  padding: 16px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-button:hover {
  background: #1976D2;
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.terms-text {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #666;
}

/* Payment Info */
.payment-info {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.success-header {
  text-align: center;
  margin-bottom: 30px;
}

.success-header h1 {
  color: #4CAF50;
  font-size: 32px;
  margin-bottom: 10px;
}

.order-code {
  font-size: 18px;
  color: #666;
}

.payment-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.payment-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row .label {
  font-weight: 600;
  color: #555;
}

.info-row .value {
  color: #333;
  text-align: right;
}

.info-row .amount {
  font-size: 24px;
  font-weight: 700;
  color: #2196F3;
}

.info-row .account-number {
  font-size: 20px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: #333;
}

.info-row.copyable {
  flex-direction: column;
}

.value-with-copy {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.copy-btn {
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-btn:hover {
  background: #e0e0e0;
}

/* QR Section */
.qr-section {
  text-align: center;
  margin: 30px 0;
  padding: 30px 0;
  border-top: 2px solid #f0f0f0;
  border-bottom: 2px solid #f0f0f0;
}

.qr-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.qr-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.qr-code {
  width: 250px;
  height: 250px;
  border: 3px solid #2196F3;
  border-radius: 12px;
  padding: 10px;
  background: white;
}

.download-qr-btn {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.download-qr-btn:hover {
  background: #45a049;
}

/* Timer */
.timer-section {
  text-align: center;
  margin: 20px 0;
  padding: 15px;
  background: #fff3e0;
  border-radius: 8px;
}

.timer {
  font-size: 18px;
  color: #f57c00;
}

.timer strong {
  font-size: 24px;
  color: #e65100;
}

/* Notes */
.notes-section {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.notes-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.notes-section ul {
  list-style: none;
  padding: 0;
}

.notes-section li {
  padding: 8px 0;
  color: #555;
}

.notes-section li::before {
  content: "• ";
  color: #2196F3;
  font-weight: bold;
  margin-right: 8px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #2196F3;
  color: white;
}

.btn-primary:hover {
  background: #1976D2;
}

.btn-secondary {
  background: white;
  color: #2196F3;
  border: 2px solid #2196F3;
}

.btn-secondary:hover {
  background: #e3f2fd;
}

/* Responsive */
@media (max-width: 768px) {
  .payment-link-page,
  .payment-info {
    padding: 10px;
  }

  .payment-card {
    padding: 20px;
  }

  .qr-code {
    width: 200px;
    height: 200px;
  }

  .action-buttons {
    flex-direction: column;
  }
}
```

---

## Payment Display

### Key Requirements

1. **Account Number Display**
   - Font: Monospace (Courier New)
   - Size: Large (20-24px)
   - Color: Dark (#333)
   - Must have Copy button

2. **Amount Display**
   - Format: `13.500.000 VND` (với dấu chấm phân cách)
   - Font: Bold, Large (24px)
   - Color: Primary blue (#2196F3)
   - Must have Copy button

3. **QR Code**
   - Size: 250x250px minimum
   - Border: 3px solid primary color
   - Background: White
   - Must be downloadable

4. **Countdown Timer**
   - Format: `X ngày HH:MM:SS`
   - Update every second
   - Highlight color when < 24h remaining
   - Show "Đã hết hạn" when expired

5. **Bank Info**
   - Bank Name: **MSB - Ngân hàng TMCP Hàng Hải Việt Nam**
   - Account Name: From VA data
   - Display prominently

---

## Error Handling

### Error Scenarios

#### 1. Invalid Token

```typescript
// When token is invalid or expired
if (error.response?.status === 404) {
  showError({
    title: 'Link không hợp lệ',
    message: 'Link này đã hết hạn hoặc không tồn tại. Vui lòng liên hệ người gửi để nhận link mới.',
    action: 'Về trang chủ'
  });
}
```

#### 2. Payment Link Exhausted

```typescript
// When max_uses reached
if (error.response?.status === 403 && error.response?.data?.message.includes('maximum uses')) {
  showError({
    title: 'Link đã hết lượt sử dụng',
    message: 'Link này đã đạt giới hạn số lượng đăng ký. Vui lòng liên hệ để nhận link mới.',
    action: 'Liên hệ hỗ trợ'
  });
}
```

#### 3. Form Validation

```typescript
const validateForm = (data: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.customer_name?.trim()) {
    errors.customer_name = 'Vui lòng nhập họ tên';
  }

  if (!data.customer_phone?.trim()) {
    errors.customer_phone = 'Vui lòng nhập số điện thoại';
  } else if (!/^0\d{9}$/.test(data.customer_phone)) {
    errors.customer_phone = 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0';
  }

  if (data.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer_email)) {
    errors.customer_email = 'Email không đúng định dạng';
  }

  return errors;
};
```

#### 4. Network Errors

```typescript
try {
  // API call
} catch (error: any) {
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    showError({
      title: 'Lỗi kết nối',
      message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.',
      action: 'Thử lại',
      onAction: () => window.location.reload()
    });
  }
}
```

---

## Testing

### Manual Testing Checklist

#### 1. Happy Path
- [ ] Access với valid token → Load payment link info
- [ ] Fill form với valid data → Submit thành công
- [ ] Hiển thị payment info với VA details
- [ ] QR code hiển thị đúng
- [ ] Copy buttons hoạt động
- [ ] Countdown timer chạy đúng
- [ ] Download QR hoạt động

#### 2. Error Cases
- [ ] Access với invalid token → Show error
- [ ] Access với expired token → Show error
- [ ] Submit form thiếu required fields → Show validation errors
- [ ] Submit với invalid phone number → Show validation error
- [ ] Submit với invalid email → Show validation error
- [ ] Network error → Show retry option

#### 3. Edge Cases
- [ ] Token with special characters
- [ ] Very long customer names
- [ ] International phone numbers (if supported)
- [ ] Expired VA → Show appropriate message
- [ ] VA creation failed → Show error

### API Testing Examples

```bash
# Test 1: Valid payment link
curl -X GET 'http://localhost:8080/api/v1/public/payment-links/abc123xyz'

# Expected: 200 OK with payment link data

# Test 2: Invalid token
curl -X GET 'http://localhost:8080/api/v1/public/payment-links/invalid-token'

# Expected: 404 Not Found

# Test 3: Create order
curl -X POST 'http://localhost:8080/api/v1/public/orders' \
  -H 'Content-Type: application/json' \
  -d '{
    "payment_link_token": "abc123xyz",
    "customer_name": "Test User",
    "customer_phone": "0912345678"
  }'

# Expected: 200 OK with order + virtual_account

# Test 4: Create order missing fields
curl -X POST 'http://localhost:8080/api/v1/public/orders' \
  -H 'Content-Type: application/json' \
  -d '{
    "payment_link_token": "abc123xyz"
  }'

# Expected: 400 Bad Request
```

---

## FAQ

### Q1: Học viên có cần tạo tài khoản không?

**A:** Không. Public Payment Site hoàn toàn không yêu cầu authentication. Học viên chỉ cần click vào link nhận được.

### Q2: Nếu học viên đóng tab trước khi thanh toán?

**A:** 
- Token vẫn còn hiệu lực → Có thể quay lại link ban đầu
- Order đã được tạo → Backend lưu order, có thể tra cứu bằng order_code
- **Khuyến nghị:** Gửi order_code + VA info qua email/SMS

### Q3: Làm sao biết học viên đã thanh toán?

**A:** 
- Backend nhận webhook từ MSB
- Cập nhật `payment_status` = "paid"
- Có thể thêm "Kiểm tra trạng thái" button poll API:
  ```
  GET /api/v1/public/orders/{id}/status
  ```

### Q4: QR Code có thời hạn không?

**A:** QR code hợp lệ cho đến khi VA hết hạn (`expiry_date`), thường là 7 ngày.

### Q5: Có thể customize thông tin trên payment page không?

**A:** Có, thông qua Payment Link settings:
- `product_name`: Tên sản phẩm/khóa học
- `notes`: Ghi chú hiển thị cho học viên
- Campaign `description`: Mô tả chi tiết

### Q6: Mobile responsive?

**A:** Có, CSS đã include responsive breakpoints. Test trên:
- iPhone (375px)
- Android (360px, 412px)
- iPad (768px)

### Q7: Có thể test mà không tạo order thật?

**A:** Backend team có thể setup mock mode:
- Trả về fake VA data
- Không gọi MSB API thật
- Liên hệ backend team để enable

---

## Support & Contact

**Technical Issues:**
- Backend Team: [contact]
- Frontend Team: [contact]

**For Students:**
- Hotline: 1800-XXXX
- Email: support@empire.com
- Zalo: [link]

---

**Document Version:** 2.0.0  
**Last Updated:** November 17, 2025  
**Related Documents:**
- [CRM Admin Integration](./MSB_VA_FRONTEND_INTEGRATION.md)
- [Backend Documentation](./DOCUMENTATION.md)
