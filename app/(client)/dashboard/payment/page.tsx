import { getOrderById } from '@/actions/orders.actions';
import { PaymentForm } from '@/components/customer/PaymentForm';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PaymentPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const { orderId } = await searchParams;
  
  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <AlertCircle className="size-12 text-destructive" />
        <h2 className="text-2xl font-bold">Invalid Request</h2>
        <p className="text-muted-foreground">Order ID is missing.</p>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  let order = null;
  try {
    order = await getOrderById(orderId);
  } catch (error) {
    console.error('Error fetching order:', error);
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <AlertCircle className="size-12 text-destructive" />
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <p className="text-muted-foreground">We couldn't find the order you are looking for.</p>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PaymentForm order={order as any} />
    </div>
  );
}

