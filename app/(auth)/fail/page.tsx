'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OAuthFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'unknown_error';

  const errorMessages: Record<string, string> = {
    oauth_failed: 'OAuth authentication failed. Please try again.',
    oauth_missing_params: 'Missing authentication parameters.',
    oauth_callback_failed: 'Failed to complete authentication.',
    access_denied: 'You denied access to your account.',
    unknown_error: 'An unknown error occurred during authentication.',
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md w-full space-y-6 text-center p-6">
        <div className="flex justify-center">
          <XCircle className="w-16 h-16 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Authentication Failed</h1>
        <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-left">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            {errorMessages[error] || errorMessages.unknown_error}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/login">Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
