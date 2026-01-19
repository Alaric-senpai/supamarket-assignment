'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function VerifySessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    if (!userId || !secret) {
      router.push('/auth/fail?error=oauth_missing_params');
      return;
    }

    // Verification is handled by the oauth route handler
    // This page is just for user feedback during the process
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md w-full space-y-6 text-center p-6">
        <div className="flex justify-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Verifying Your Session</h1>
        <p className="text-muted-foreground">
          Please wait while we complete your authentication...
        </p>
      </div>
    </div>
  );
}
