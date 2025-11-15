# Payment Page Implementation Documentation

## Overview

This document describes the implementation of the payment page system for the Payment Empire application. The system allows customers to complete purchases through a secure payment flow with QR code-based bank transfers.

## Architecture

### Components

#### 1. Payment Page (`/payment/[linkId]`)

The main payment page is a dynamic route that accepts a payment link ID as a parameter.

**Features:**
- Displays complete campaign information
- Collects customer personal information
- Shows payment method based on campaign configuration
- Generates and displays QR code for payment
- Real-time payment status checking

**Files:**
- `src/app/payment/[linkId]/page.tsx` - Route handler
- `src/app/payment/[linkId]/PaymentPage.tsx` - Main page component
- `src/app/payment/[linkId]/components/CampaignInfo.tsx` - Campaign details display
- `src/app/payment/[linkId]/components/CustomerForm.tsx` - Customer information form
- `src/app/payment/[linkId]/components/PaymentMethod.tsx` - Payment method display
- `src/app/payment/[linkId]/components/QRCodeDisplay.tsx` - QR code display

#### 2. Payment Service (`src/lib/services/payment.service.ts`)

Handles all payment-related API calls:
- `getPaymentLink(linkId)` - Retrieve payment link data
- `getCampaign(campaignId)` - Get campaign details
- `createOrder(campaignId, customerInfo)` - Create payment order
- `generateQRCode(orderId, bankCode)` - Generate payment QR code
- `checkOrderStatus(orderId)` - Check order payment status
- `updateOrderStatus(orderId, status, transactionId)` - Update order status

#### 3. Webhook Endpoint (`/api/webhooks/payment`)

Receives payment confirmations from the bank and processes post-payment actions.

**POST `/api/webhooks/payment`**

Expected payload:
```json
{
  "transactionId": "string",
  "orderId": "string",
  "amount": number,
  "status": "success" | "failed",
  "timestamp": "string",
  "bankCode": "string"
}
```

**Actions on successful payment:**
1. Update order status to "paid"
2. Create user account with customer information
3. Add user to campaign group (if specified)
4. Send confirmation email with login credentials

## Payment Flow

### 1. Customer Arrives at Payment Page

```
Customer clicks payment link → /payment/[linkId]
```

The system:
- Validates the payment link
- Loads campaign information
- Displays campaign details with pricing

### 2. Customer Fills Information

The customer provides:
- Full name (required)
- Phone number (required)
- Email (required)
- Address (required)

### 3. Payment Method Display

- Shows the payment method based on campaign configuration
- Default: MSB Bank (Ngân hàng TMCP Hàng Hải Việt Nam)
- Displays bank transfer as the payment option

### 4. Payment Submission

When customer clicks "Thanh toán" button:

1. **Validate form data**
   - All fields must be filled
   
2. **Create order**
   ```typescript
   POST /orders
   {
     campaignId: string,
     customerInfo: CustomerInfo
   }
   ```

3. **Generate QR code**
   ```typescript
   POST /payments/generate-qr
   {
     orderId: string,
     bankCode: string
   }
   ```

4. **Display QR code**
   - Show QR code image
   - Display payment amount
   - Provide payment instructions

### 5. Payment Status Checking

Once QR code is displayed:
- System polls payment status every 5 seconds
- Checks order status via API
- Displays loading indicator while checking

### 6. Payment Confirmation

When bank processes payment:

1. **Bank sends webhook**
   ```
   POST /api/webhooks/payment
   ```

2. **Webhook processing**
   - Update order status to "paid"
   - Create user account
   - Add user to group
   - Send confirmation email

3. **Customer notification**
   - Display success message
   - Show order ID
   - Inform about email confirmation

## Data Types

### Campaign

```typescript
interface Campaign {
  id: string;
  name: string;
  description: string;
  product: string;
  imageUrl: string;
  originalPrice: number;
  discount1?: number;        // Discount percentage
  discount2?: number;        // Additional discount
  discount3?: number;        // Additional discount
  finalPrice: number;
  bankCode: string;          // Default: 'MSB'
  groupId?: string;          // Group to add user to
}
```

### Customer Information

```typescript
interface CustomerInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
}
```

### Payment Order

```typescript
interface PaymentOrder {
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
```

## API Integration

### Required Backend Endpoints

The frontend expects the following backend API endpoints:

1. **GET `/payment-links/:linkId`**
   - Returns payment link data with campaign information
   
2. **GET `/campaigns/:campaignId`**
   - Returns campaign details

3. **POST `/orders`**
   - Creates a new payment order
   - Body: `{ campaignId, customerInfo }`

4. **POST `/payments/generate-qr`**
   - Generates QR code for payment
   - Body: `{ orderId, bankCode }`

5. **GET `/orders/:orderId`**
   - Returns order details and status

6. **PATCH `/orders/:orderId/status`**
   - Updates order status
   - Body: `{ status, transactionId? }`

7. **POST `/users`**
   - Creates a new user account
   - Body: customer information

8. **POST `/groups/:groupId/members`**
   - Adds user to group
   - Body: `{ userId }`

9. **POST `/emails/send-payment-confirmation`**
   - Sends confirmation email
   - Body: order and user credential information

### Bank Integration

The system integrates with bank APIs for QR code generation:

**Supported Banks:**
- MSB (Maritime Bank) - Default
- VCB (Vietcombank)
- TCB (Techcombank)
- ACB (Asia Commercial Bank)
- VPB (VPBank)
- MB (Military Bank)
- BIDV
- VIB

Each bank should provide:
1. QR code generation API
2. Webhook configuration for payment notifications
3. Signature verification method for webhooks

## Environment Variables

Required environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
```

## Security Considerations

### Webhook Security

The webhook endpoint should implement:

1. **Signature Verification**
   - Verify requests are from the actual bank
   - Each bank has its own signature method
   - Implement per-bank verification logic

2. **IP Whitelisting**
   - Only accept webhooks from bank IP addresses
   - Configure firewall rules

3. **HTTPS Only**
   - Always use HTTPS for webhook endpoints
   - Ensure SSL/TLS certificates are valid

### Data Protection

- Customer information is transmitted securely via HTTPS
- Payment processing follows PCI compliance guidelines
- Sensitive data is not stored in frontend state longer than necessary
- User credentials are generated securely on backend

## UI/UX Features

### Responsive Design

- Mobile-first approach
- Works on all screen sizes
- Touch-friendly buttons and inputs

### Loading States

- Loading spinner during data fetch
- Processing indicator during payment submission
- Real-time status checking feedback

### Error Handling

- Graceful error messages
- Form validation feedback
- Network error handling
- Invalid link detection

### Visual Design

- Clean, modern interface
- Clear pricing display with discount breakdown
- Intuitive form layout
- Visual confirmation of payment method
- Step-by-step payment instructions

## Testing

### Manual Testing Checklist

- [ ] Payment link loads correctly
- [ ] Campaign information displays properly
- [ ] Image loading works
- [ ] Discount calculations are correct
- [ ] Form validation works
- [ ] Payment method displays correct bank
- [ ] QR code generates successfully
- [ ] Payment status polling works
- [ ] Success state displays after payment
- [ ] Error handling works for invalid links
- [ ] Webhook processes payment correctly
- [ ] User account is created
- [ ] Group membership is assigned
- [ ] Confirmation email is sent

### Test Data

Example payment link structure:
```
/payment/test-link-12345
```

Example campaign data:
```json
{
  "id": "campaign-123",
  "name": "Premium Membership",
  "description": "Access to all premium features",
  "product": "1 Year Subscription",
  "imageUrl": "https://example.com/image.jpg",
  "originalPrice": 1000000,
  "discount1": 20,
  "discount2": 10,
  "finalPrice": 720000,
  "bankCode": "MSB",
  "groupId": "premium-members"
}
```

## Future Enhancements

Potential improvements for future versions:

1. **Multiple Payment Methods**
   - Add credit card support
   - Add e-wallet integration (Momo, ZaloPay)
   - Add installment payment options

2. **Enhanced Security**
   - Add CAPTCHA for form submission
   - Implement rate limiting
   - Add fraud detection

3. **User Experience**
   - Add payment history page
   - Implement order tracking
   - Add PDF invoice generation

4. **Analytics**
   - Track conversion rates
   - Monitor payment success rates
   - Analyze user behavior

5. **Internationalization**
   - Support multiple languages
   - Support multiple currencies
   - Localize date/time formats

## Support

For issues or questions about the payment implementation:

1. Check the logs for error details
2. Verify environment variables are set correctly
3. Ensure backend API endpoints are accessible
4. Confirm bank API integration is working
5. Check webhook configuration and signatures

## Version History

- **v1.0** (2025-11-15) - Initial implementation
  - Payment page with campaign display
  - Customer information form
  - QR code generation
  - Webhook integration
  - User creation and group assignment
  - Email confirmation
