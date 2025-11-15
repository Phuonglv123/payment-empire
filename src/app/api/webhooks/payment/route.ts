import { NextRequest, NextResponse } from 'next/server';
import { WebhookPayload } from '@/lib/types/payment.types';

/**
 * Webhook endpoint to receive payment confirmation from bank
 * This endpoint is called by the bank when a payment is completed
 */
export async function POST(request: NextRequest) {
  try {
    // Parse webhook payload
    const payload: WebhookPayload = await request.json();

    console.log('Received payment webhook:', payload);

    // Validate webhook payload
    if (!payload.transactionId || !payload.orderId || !payload.status) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    // TODO: Verify webhook signature/authentication from bank
    // This is important for security to ensure the webhook is from the actual bank
    // Each bank will have their own signature verification method

    // Handle payment based on status
    if (payload.status === 'success') {
      await handleSuccessfulPayment(payload);
    } else if (payload.status === 'failed') {
      await handleFailedPayment(payload);
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handleSuccessfulPayment(payload: WebhookPayload) {
  try {
    // 1. Update order status to 'paid'
    await updateOrderStatus(payload.orderId, 'paid', payload.transactionId);

    // 2. Get order details to retrieve customer information and campaign
    const order = await getOrderDetails(payload.orderId);

    // 3. Create user account for customer
    const userCredentials = await createUserAccount(order);

    // 4. Add user to campaign group
    if (order.campaign.groupId) {
      await addUserToGroup(userCredentials.userId, order.campaign.groupId);
    }

    // 5. Send confirmation email with login credentials
    await sendConfirmationEmail(order, userCredentials);

    console.log(`Payment successful for order ${payload.orderId}`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
}

/**
 * Handle failed payment
 */
async function handleFailedPayment(payload: WebhookPayload) {
  try {
    // Update order status to 'failed'
    await updateOrderStatus(payload.orderId, 'failed', payload.transactionId);

    console.log(`Payment failed for order ${payload.orderId}`);
  } catch (error) {
    console.error('Error handling failed payment:', error);
    throw error;
  }
}

/**
 * Update order status in the database
 */
async function updateOrderStatus(
  orderId: string,
  status: 'paid' | 'failed',
  transactionId?: string
) {
  // TODO: Implement actual API call to update order status
  // This would typically call your backend API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}/status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, transactionId }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update order status');
  }

  return response.json();
}

interface OrderDetails {
  id: string;
  customerInfo: {
    email: string;
    fullName: string;
    phoneNumber: string;
    address: string;
  };
  campaign: {
    name: string;
    groupId?: string;
  };
  amount: number;
}

interface UserCredentials {
  userId: string;
  username: string;
  password: string;
}

/**
 * Get order details
 */
async function getOrderDetails(orderId: string): Promise<OrderDetails> {
  // TODO: Implement actual API call to get order details
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get order details');
  }

  return response.json();
}

/**
 * Create user account for customer
 */
async function createUserAccount(order: OrderDetails): Promise<UserCredentials> {
  // TODO: Implement actual API call to create user
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: order.customerInfo.email,
        fullName: order.customerInfo.fullName,
        phoneNumber: order.customerInfo.phoneNumber,
        address: order.customerInfo.address,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create user account');
  }

  return response.json();
}

/**
 * Add user to group
 */
async function addUserToGroup(userId: string, groupId: string) {
  // TODO: Implement actual API call to add user to group
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/groups/${groupId}/members`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to add user to group');
  }

  return response.json();
}

/**
 * Send confirmation email to customer
 */
async function sendConfirmationEmail(order: OrderDetails, userCredentials: UserCredentials) {
  // TODO: Implement actual email sending
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/emails/send-payment-confirmation`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: order.customerInfo.email,
        orderId: order.id,
        amount: order.amount,
        campaignName: order.campaign.name,
        userCredentials: {
          username: userCredentials.username,
          password: userCredentials.password,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to send confirmation email');
  }

  return response.json();
}
