# Payment Empire

A modern payment management system built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 16** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Phuonglv123/payment-empire.git
cd payment-empire
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file from the example:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build the production application:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
payment-empire/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/                # API routes
│   │   │   └── webhooks/       # Webhook endpoints
│   │   │       └── payment/    # Payment webhook
│   │   ├── payment/            # Payment pages
│   │   │   └── [linkId]/       # Dynamic payment page
│   │   │       ├── components/ # Payment UI components
│   │   │       ├── page.tsx    # Route handler
│   │   │       └── PaymentPage.tsx # Main payment component
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   └── lib/                    # Utility functions and configurations
│       ├── types/              # TypeScript type definitions
│       │   └── payment.types.ts
│       ├── services/           # API service modules
│       │   ├── payment.service.ts
│       │   └── example.service.ts
│       └── axios.ts            # Axios instance configuration
├── public/                     # Static files
├── PAYMENT_IMPLEMENTATION.md   # Payment system documentation
├── .env.example                # Environment variables example
└── package.json                # Dependencies and scripts
```

## Axios Configuration

The project includes a pre-configured Axios instance located at `src/lib/axios.ts` with the following features:

- **Base URL Configuration**: Set via `NEXT_PUBLIC_API_BASE_URL` environment variable
- **Request Interceptors**: Automatically adds authentication tokens
- **Response Interceptors**: Handles errors globally
- **TypeScript Support**: Full type safety with generics
- **Helper Methods**: Convenient API methods (get, post, put, patch, delete)

### Usage Examples

#### Basic Usage

```typescript
import { api } from '@/lib/axios';

// GET request
const users = await api.get('/users');

// POST request
const newUser = await api.post('/users', { name: 'John', email: 'john@example.com' });

// PUT request
const updatedUser = await api.put('/users/1', { name: 'John Doe' });

// DELETE request
await api.delete('/users/1');
```

#### With Type Safety

```typescript
import { api } from '@/lib/axios';

interface User {
  id: number;
  name: string;
  email: string;
}

// Type-safe GET request
const response = await api.get<User[]>('/users');
const users: User[] = response.data;

// Type-safe POST request
const response = await api.post<User>('/users', {
  name: 'John',
  email: 'john@example.com'
});
const newUser: User = response.data;
```

#### Creating API Services

See `src/lib/services/example.service.ts` for a complete example of how to create API service modules.

```typescript
import { api } from '@/lib/axios';

export const paymentService = {
  getPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },
  
  createPayment: async (data) => {
    const response = await api.post('/payments', data);
    return response.data;
  },
};
```

## Features

- ✅ Next.js 16 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Configured Axios instance with interceptors
- ✅ Environment variable support
- ✅ ESLint configuration
- ✅ Development and production builds
- ✅ **Payment Page System** - Complete payment flow with QR code integration
  - Campaign information display with discount breakdown
  - Customer information collection
  - Bank QR code payment integration
  - Webhook for payment confirmation
  - Automatic user creation and group assignment
  - Email confirmation system

## Payment System

The application includes a complete payment processing system for customers. When customers click on a payment link created by sales, they are directed to a payment page where they can:

- View complete campaign details (name, description, product, pricing, discounts)
- Fill in personal information (name, phone, email, address)
- Make payment via bank transfer using QR code
- Receive automatic confirmation and login credentials

For detailed documentation on the payment system, see [PAYMENT_IMPLEMENTATION.md](./PAYMENT_IMPLEMENTATION.md).

### Payment Flow

1. Customer clicks payment link → `/payment/[linkId]`
2. System displays campaign information with pricing
3. Customer fills in personal information
4. System generates QR code for bank transfer
5. Customer scans and pays via banking app
6. Bank sends webhook confirmation
7. System creates user account and assigns to group
8. Customer receives email with login credentials

### Webhook Integration

The system includes a webhook endpoint at `/api/webhooks/payment` to receive payment confirmations from banks. Upon successful payment:

- Order status is updated to "paid"
- User account is automatically created
- User is added to the campaign group
- Confirmation email is sent with login credentials

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

Cập nhật lại phần thanh toán. khi lấy thông tin payment link sẽ có thêm 2. field mới trong campaign là used_quantity và max_quantity. Khi hiển thị thông tin chiến dịch trên trang thanh toán, nếu used_quantity >= max_quantity thì sẽ hiển thị thông báo "Chương trình đã hết hạn" và không cho phép người dùng tiếp tục điền thông tin thanh toán.

Thay đổi lại luồng thanh toán cho hệ thống để phù hơn hợp với yêu cầu mới như sau:


## Cách sử dụng cho Order Public FE

### Request tạo order:
```typescript
POST /api/v1/public/orders
Content-Type: application/json

{
  "customer_name": "Nguyễn Văn A",
  "customer_phone": "0901234567",
  "campaign_id": "uuid-campaign",
  "customer_email": "email@test.com",        // optional
  "payment_channel": "msb",                   // "msb" hoặc "manual"
  "return_url": "https://order.example.com/payment/result"  // URL redirect sau thanh toán
}
```

### Response:
```json
{
  "errorCode": "SUCCESS",
  "message": "Order created successfully",
  "data": {
    "id": "order-uuid",
    "order_code": "ORD-20251224-001",
    "customer_name": "Nguyễn Văn A",
    "total_amount": 1000000,
    ...
  },
  "payment_url": "https://acq-stating.msb.com.vn/payment/...",
  "session_id": "session-uuid",
  "expires_at": "2025-12-24T10:05:00Z"
}
```

### FE Flow:
```typescript
// 1. Gọi API tạo order
const response = await fetch('/api/v1/public/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customer_name: formData.name,
    customer_phone: formData.phone,
    campaign_id: campaignId,
    payment_channel: 'msb',
    return_url: `${window.location.origin}/payment/result`
  })
});

const data = await response.json();

// 2. Redirect đến trang thanh toán MSB
if (data.payment_url) {
  window.location.href = data.payment_url;
}
```

### Trang `/payment/result`:
```typescript
// URL sẽ có params: ?session_id=xxx&status=success&order_id=xxx
const params = new URLSearchParams(window.location.search);
const status = params.get('status');
const orderId = params.get('order_id');

if (status === 'success') {
  // Hiển thị "Thanh toán thành công"
} else {
  // Hiển thị "Thanh toán thất bại hoặc đang xử lý"
}
```
Vậy cần có 1 route mới `/payment/result` để hiển thị kết quả thanh toán cho khách hàng.
Chuyển hướng luồng thanh toán sang sử dụng hệ thống thanh toán của MSB thay vì QR code ngân hàng như trước đây.
1. Khách hàng truy cập link thanh toán `/payment/[linkId]`.
2. Hệ thống kiểm tra `used_quantity` và `max_quantity` của chiến dịch.
   - Nếu `used_quantity >= max_quantity`, hiển thị thông báo "Chương trình đã hết hạn" và không cho phép điền thông tin thanh toán.
   - Nếu còn hạn, hiển thị thông tin chiến dịch và form điền thông tin khách hàng.
3. Khách hàng điền thông tin và gửi form.
4. Hệ thống gọi API tạo order và nhận về `payment_url` từ MSB.
5. Chuyển hướng khách hàng đến `payment_url` để thực hiện thanh toán.
6. Sau khi thanh toán, khách hàng được chuyển hướng về trang `/payment/result` với trạng thái thanh toán.
7. Hệ thống hiển thị kết quả thanh toán (thành công/thất bại) dựa trên tham số trong URL.