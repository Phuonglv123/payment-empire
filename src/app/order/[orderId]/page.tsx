import OrderPaymentPage from './OrderPaymentPage';

interface OrderPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  
  return <OrderPaymentPage orderId={orderId} />;
}
