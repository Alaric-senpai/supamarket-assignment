'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OAuthServerAction } from '@/actions/auth.actions';
import { Loader2 } from 'lucide-react';

const providers = [
  { id: 'google', name: 'Google', icon: '🔵', description: 'Connect your Google account' },
  { id: 'github', name: 'GitHub', icon: '⚫', description: 'Connect your GitHub account' },
  { id: 'microsoft', name: 'Microsoft', icon: '🔷', description: 'Connect your Microsoft account' },
  { id: 'apple', name: 'Apple', icon: '🍎', description: 'Connect your Apple account' },
  { id: 'facebook', name: 'Facebook', icon: '🔵', description: 'Connect your Facebook account' },
];

export default function LinkAccountPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleLinkProvider = async (provider: string) => {
    setLoading(provider);
    
    try {
      const result = await OAuthServerAction({ provider: provider as any });
      
      // Handle safe-action result structure
      if (result && 'data' in result && result.data?.success && 'data' in result.data && result.data.data?.redirectUrl) {
        window.location.href = result.data.data.redirectUrl;
      } else {
        const errorMessage = result && 'data' in result && result.data?.message 
          ? result.data.message 
          : 'Failed to initialize OAuth';
        alert(errorMessage);
        setLoading(null);
      }
    } catch (error) {
      console.error('OAuth error:', error);
      alert('An error occurred');
      setLoading(null);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Link Account</h1>
        <p className="text-muted-foreground">
          Connect additional accounts to sign in with multiple providers
        </p>
      </div>

      <div className="grid gap-4">
        {providers.map((provider) => (
          <Card key={provider.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{provider.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg">{provider.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {provider.description}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleLinkProvider(provider.id)}
                disabled={loading !== null}
              >
                {loading === provider.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-2">Note</h3>
        <p className="text-sm text-muted-foreground">
          Linking additional accounts allows you to sign in using any of your connected providers.
          You can manage and unlink accounts from your account security settings.
        </p>
      </Card>
    </div>
  );
}
