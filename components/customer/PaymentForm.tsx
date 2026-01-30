'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Smartphone, CheckCircle2, XCircle } from 'lucide-react';
import { initiatePayment, getPaymentStatus } from '@/actions/payments.actions';
import { formatPhoneNumber } from '@/lib/mpesa';
import { toast } from 'sonner';
import type { OrderWithRelations } from '@/lib/types';

interface PaymentFormProps {
  order: OrderWithRelations;
}

export function PaymentForm({ order }: PaymentFormProps) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);

  // Poll payment status every 2 seconds for up to 60 seconds
  useEffect(() => {
    if (!isPolling || !checkoutRequestId) return;

    const interval = setInterval(async () => {
      try {
        const payment = await getPaymentStatus(order.$id);

        if (payment?.status === 'SUCCESS') {
          setIsPolling(false);
          toast.success('Payment successful!');
          router.push(`/dashboard/confirmation?orderId=${order.$id}`);
        } else if (payment?.status === 'FAILED') {
          setIsPolling(false);
          toast.error('Payment failed. Please try again.');
          setIsProcessing(false);
        } else {
          setPollCount((prev) => {
             const next = prev + 1;
             // Stop polling after 30 attempts (60 seconds)
             if (next >= 30) {
               setIsPolling(false);
               setIsProcessing(false);
               toast.error('Payment timeout. Please check your M-Pesa messages.');
               clearInterval(interval);
             }
             return next;
          });
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPolling, checkoutRequestId, order.$id, router]);

  const handleInitiatePayment = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }

    const formatted = formatPhoneNumber(phoneNumber);

    if (!/^254\d{9}$/.test(formatted)) {
      toast.error('Invalid phone number. Use format: 0712345678 or 254712345678');
      return;
    }

    setIsProcessing(true);
    setPollCount(0);

    try {
      const result = await initiatePayment({
        orderId: order.$id,
        phoneNumber: formatted,
      });

      if (result.success && result.checkoutRequestId) {
        setCheckoutRequestId(result.checkoutRequestId);
        setIsPolling(true);
        toast.success('STK push sent! Please check your phone.');
      } else {
        toast.error(result.message || 'Failed to initiate payment');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('An error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleCancelPayment = () => {
    setIsPolling(false);
    setIsProcessing(false);
    setCheckoutRequestId(null);
    setPollCount(0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Payment</h1>
          <p className="text-muted-foreground">
            Complete your payment via M-Pesa
          </p>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-sm">{order.$id.substring(0, 12)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Branch</span>
              <span>{order.branch?.name}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total Amount</span>
              <span className="text-primary font-bold">
                KES {parseFloat(order.totalAmount).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              M-Pesa Payment
            </CardTitle>
            <CardDescription>
              Enter your M-Pesa registered phone number to receive the payment prompt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0712345678 or 254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isProcessing}
              />
              <p className="text-xs text-muted-foreground">
                Format: 0712345678 or 254712345678
              </p>
            </div>

            {isProcessing && (
              <Alert>
                <Loader2 className="w-4 h-4 animate-spin" />
                <AlertDescription>
                  {isPolling ? (
                    <>
                      Waiting for M-Pesa confirmation...
                      <br />
                      <span className="text-xs">
                        Please check your phone and enter your M-Pesa PIN
                      </span>
                    </>
                  ) : (
                    'Initiating payment...'
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              {!isProcessing ? (
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleInitiatePayment}
                >
                  Pay Now
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelPayment}
                >
                  Cancel
                </Button>
              )}
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                <strong>Instructions:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Enter your M-Pesa registered phone number</li>
                  <li>Click "Pay Now" to receive an STK push</li>
                  <li>Check your phone for the M-Pesa prompt</li>
                  <li>Enter your M-Pesa PIN to complete payment</li>
                </ol>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
