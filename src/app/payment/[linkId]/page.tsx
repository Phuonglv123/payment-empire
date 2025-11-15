import PaymentPage from '@/app/payment/[linkId]/PaymentPage';

interface PaymentPageProps {
  params: Promise<{
    linkId: string;
  }>;
}

export default async function Payment({ params }: PaymentPageProps) {
  const { linkId } = await params;
  
  return <PaymentPage linkId={linkId} />;
}
