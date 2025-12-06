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

Cần điều chỉnh lại logic hiện thị thông tin sản phẩm và giá tiền cho phù hợp với ngữ cảnh học phí khóa học thay vì giá sản phẩm bán lẻ.
logic như sau:
- hiện thị "Học phí gốc" thay vì "Giá gốc"
- hiện thị "Chiết khấu" thay vì "Khuyến mãi"
- hiện thị số tiền cần phải thanh toán sau khi đã áp dụng chiết khấu
- Ví dụ: 
  Học phí gốc: 5,000,000 VND
  Chiết khấu (KM02) còn lại: 3,500,000 VND (giảm 1,500,000 VND) 
  Tổng học phí cần thanh toán: 3,500,000 VND