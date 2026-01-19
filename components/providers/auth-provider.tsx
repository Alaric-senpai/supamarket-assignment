'use client';

import { Models } from 'node-appwrite';
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { getCurrentUser, Logout, validateSession } from '@/actions/auth.actions';
import { getSessionStatus, checkAndManageSession } from '@/lib/session-manager';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    user: Models.User | null;
    role: 'admin' | 'client';
    isLoading: boolean;
    isAuthenticated: boolean;
    sessionExpiry: Date | null;
    timeRemaining: number | null;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [role, setUserRole] = useState<'admin' | 'client'>('client');
    const [user, setUser] = useState<Models.User | null>(null);
    const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    
    const router = useRouter();
    const pathname = usePathname();

    /**
     * Fetch and set current user data
     */
    const refreshUser = useCallback(async () => {
        try {
            const result = await getCurrentUser();
            
            if (result.success && result.user) {
                setUser(result.user);
                setIsAuthenticated(true);
                
                // Determine user role from prefs or default
                const userRole = (result.user.prefs?.role as 'admin' | 'client') || 'client';
                setUserRole(userRole);
            } else {
                setUser(null);
                setIsAuthenticated(false);
                setUserRole('client');
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
            setUser(null);
            setIsAuthenticated(false);
        }
    }, []);

    /**
     * Check and manage session status
     */
    const checkSession = useCallback(async () => {
        try {
            const status = await getSessionStatus();
            
            if (status.active && status.expiry) {
                setSessionExpiry(new Date(status.expiry));
                setTimeRemaining(status.timeRemaining || 0);
                
                // Auto-manage session (refresh if needed)
                await checkAndManageSession();
            } else {
                setSessionExpiry(null);
                setTimeRemaining(null);
                
                // Session expired or invalid
                if (isAuthenticated) {
                    setIsAuthenticated(false);
                    setUser(null);
                    
                    // Redirect to login if on protected route
                    if (!pathname?.startsWith('/(auth)') && pathname !== '/') {
                        router.push('/login?error=session_expired');
                    }
                }
            }
        } catch (error) {
            console.error('Session check failed:', error);
        }
    }, [isAuthenticated, pathname, router]);

    /**
     * Logout user
     */
    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            await Logout();
            
            setUser(null);
            setIsAuthenticated(false);
            setUserRole('client');
            setSessionExpiry(null);
            setTimeRemaining(null);
            
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    /**
     * Initialize auth state on mount
     */
    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true);
            
            try {
                // Validate session first
                const isValid = await validateSession();
                
                if (isValid) {
                    await refreshUser();
                    await checkSession();
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth initialization failed:', error);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    /**
     * Set up session monitoring interval
     * Check session every 5 minutes
     */
    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(() => {
            checkSession();
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval);
    }, [isAuthenticated, checkSession]);

    /**
     * Update time remaining countdown every minute
     */
    useEffect(() => {
        if (!isAuthenticated || !sessionExpiry) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const expiry = sessionExpiry.getTime();
            const remaining = Math.max(0, expiry - now);
            
            setTimeRemaining(remaining);
            
            // If expired, trigger session check
            if (remaining === 0) {
                checkSession();
            }
        }, 60 * 1000); // Every minute

        return () => clearInterval(interval);
    }, [isAuthenticated, sessionExpiry, checkSession]);

    const value: AuthContextType = useMemo(
        () => ({
            user,
            logout,
            isLoading,
            isAuthenticated,
            role,
            sessionExpiry,
            timeRemaining,
            refreshUser,
            checkSession,
        }),
        [user, isLoading, isAuthenticated, role, sessionExpiry, timeRemaining, logout, refreshUser, checkSession]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};