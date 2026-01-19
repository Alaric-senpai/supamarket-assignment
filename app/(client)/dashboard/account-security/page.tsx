'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { getLinkedIdentities, unlinkIdentity, listActiveSessions, deleteSessionById } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Link2, Unlink, Shield, Monitor, Smartphone, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Identity {
  $id: string;
  provider: string;
  providerId: string;
  providerEmail?: string;
  providerAccessToken?: string;
  providerAccessTokenExpiry?: string;
}

interface Session {
  $id: string;
  provider: string;
  current: boolean;
  deviceName?: string;
  deviceBrand?: string;
  deviceModel?: string;
  osName?: string;
  osVersion?: string;
  clientName?: string;
  clientVersion?: string;
  ip?: string;
  countryName?: string;
  $createdAt: string;
  expire: string;
}

export default function AccountSecurityPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingIdentities, setIsLoadingIdentities] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadIdentities();
      loadSessions();
    }
  }, [isAuthenticated]);

  const loadIdentities = async () => {
    setIsLoadingIdentities(true);
    try {
      const result = await getLinkedIdentities();
      if (result.success) {
        setIdentities(result.identities as Identity[]);
      }
    } catch (error) {
      console.error('Failed to load identities:', error);
    } finally {
      setIsLoadingIdentities(false);
    }
  };

  const loadSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const result = await listActiveSessions();
      if (result.success) {
        setSessions(result.sessions as Session[]);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const handleUnlinkIdentity = async (identityId: string, provider: string) => {
    if (!confirm(`Are you sure you want to unlink your ${provider} account?`)) {
      return;
    }

    try {
      const result = await unlinkIdentity(identityId);
      if (result.success) {
        await loadIdentities();
        alert('Identity unlinked successfully');
      } else {
        alert(result.message || 'Failed to unlink identity');
      }
    } catch (error) {
      console.error('Failed to unlink identity:', error);
      alert('An error occurred while unlinking identity');
    }
  };

  const handleDeleteSession = async (sessionId: string, isCurrent: boolean) => {
    if (isCurrent) {
      if (!confirm('This will log you out. Continue?')) {
        return;
      }
    } else {
      if (!confirm('Are you sure you want to revoke this session?')) {
        return;
      }
    }

    try {
      const result = await deleteSessionById(sessionId);
      if (result.success) {
        if (isCurrent) {
          router.push('/login');
        } else {
          await loadSessions();
        }
      } else {
        alert(result.message || 'Failed to delete session');
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      alert('An error occurred while deleting session');
    }
  };

  const getProviderIcon = (provider: string) => {
    const icons: Record<string, string> = {
      google: '🔵',
      github: '⚫',
      microsoft: '🔷',
      apple: '🍎',
      facebook: '🔵',
    };
    return icons[provider.toLowerCase()] || '🔗';
  };

  const getDeviceIcon = (deviceName?: string, osName?: string) => {
    if (deviceName?.includes('mobile') || osName?.includes('iOS') || osName?.includes('Android')) {
      return <Smartphone className="w-5 h-5" />;
    }
    return <Monitor className="w-5 h-5" />;
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Account Security</h1>
        <p className="text-muted-foreground">
          Manage your connected accounts and active sessions
        </p>
      </div>

      {/* Linked Identities */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Connected Accounts</h2>
        </div>
        
        {isLoadingIdentities ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : identities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No connected accounts found
          </p>
        ) : (
          <div className="space-y-3">
            {identities.map((identity) => (
              <div
                key={identity.$id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getProviderIcon(identity.provider)}</span>
                  <div>
                    <p className="font-medium capitalize">{identity.provider}</p>
                    {identity.providerEmail && (
                      <p className="text-sm text-muted-foreground">
                        {identity.providerEmail}
                      </p>
                    )}
                    {identity.providerAccessTokenExpiry && (
                      <p className="text-xs text-muted-foreground">
                        Token expires: {new Date(identity.providerAccessTokenExpiry).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleUnlinkIdentity(identity.$id, identity.provider)}
                  disabled={identities.length === 1}
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  Unlink
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Active Sessions */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Active Sessions</h2>
        </div>
        
        {isLoadingSessions ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No active sessions found
          </p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.$id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="flex items-start gap-3">
                  {getDeviceIcon(session.deviceName, session.osName)}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {session.deviceBrand || session.deviceName || 'Unknown Device'}
                      </p>
                      {session.current && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      {session.osName && (
                        <p>{session.osName} {session.osVersion}</p>
                      )}
                      {session.clientName && (
                        <p>{session.clientName} {session.clientVersion}</p>
                      )}
                      {session.ip && session.countryName && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          <span>{session.ip} • {session.countryName}</span>
                        </div>
                      )}
                      <p className="text-xs">
                        Created: {new Date(session.$createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs">
                        Expires: {new Date(session.expire).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSession(session.$id, session.current)}
                >
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
