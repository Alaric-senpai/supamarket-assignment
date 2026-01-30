// M-Pesa Sandbox Integration Utilities

import { mpesaConfig } from '@/config/appwrite.config';
import type { MpesaSTKPushRequest, MpesaSTKPushResponse } from './types';

const MPESA_API_BASE = 'https://sandbox.safaricom.co.ke';

// Cache for access token
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get M-Pesa OAuth access token
 * Caches token for 59 minutes (expires in 60)
 */
export async function getAccessToken(): Promise<string> {
    // Check if we have a valid cached token
    if (cachedToken && Date.now() < cachedToken.expiresAt) {
        return cachedToken.token;
    }

    const auth = Buffer.from(`${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`).toString('base64');

    try {
        const response = await fetch(
            `${MPESA_API_BASE}/oauth/v1/generate?grant_type=client_credentials`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to get access token: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache token for 59 minutes
        cachedToken = {
            token: data.access_token,
            expiresAt: Date.now() + 59 * 60 * 1000,
        };

        return data.access_token;
    } catch (error) {
        console.error('Error getting M-Pesa access token:', error);
        throw error;
    }
}

/**
 * Generate M-Pesa password
 * Format: Base64(BusinessShortCode + Passkey + Timestamp)
 */
export function generatePassword(timestamp: string): string {
    const shortCode = mpesaConfig.shortCode;
    const passkey = mpesaConfig.passkey;

    if (!shortCode || !passkey) {
        throw new Error('M-Pesa short code or passkey not configured');
    }

    const str = shortCode + passkey + timestamp;
    return Buffer.from(str).toString('base64');
}

/**
 * Get current timestamp in M-Pesa format
 * Format: YYYYMMDDHHmmss
 */
export function getTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Validate phone number format
 * Must be 254XXXXXXXXX (12 digits)
 */
export function validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^254\d{9}$/;
    return phoneRegex.test(phone);
}

/**
 * Validate payment amount
 * Must be > 0 and <= 999999
 */
export function validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 999999;
}

/**
 * Initiate M-Pesa STK Push
 * Sends payment request to customer's phone
 */
export async function initiateSTKPush(
    request: MpesaSTKPushRequest
): Promise<MpesaSTKPushResponse> {
    const { phoneNumber, amount, orderId, accountReference } = request;

    // Validate inputs
    if (!validatePhoneNumber(phoneNumber)) {
        return {
            success: false,
            error: 'Invalid phone number format. Must be 254XXXXXXXXX',
        };
    }

    if (!validateAmount(amount)) {
        return {
            success: false,
            error: 'Invalid amount. Must be between 1 and 999999',
        };
    }

    const shortCode = mpesaConfig.shortCode;
    const callbackUrl = mpesaConfig.callbackUrl;

    if (!shortCode || !callbackUrl) {
        return {
            success: false,
            error: 'M-Pesa configuration incomplete',
        };
    }

    try {
        // Get access token
        const accessToken = await getAccessToken();

        // Generate timestamp and password
        const timestamp = getTimestamp();
        const password = generatePassword(timestamp);

        // Prepare request body
        const requestBody = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.ceil(amount), // M-Pesa requires integer
            PartyA: phoneNumber,
            PartyB: shortCode,
            PhoneNumber: phoneNumber,
            CallBackURL: callbackUrl,
            AccountReference: accountReference,
            TransactionDesc: `Order ${orderId}`,
        };

        console.log('Initiating STK Push:', {
            phoneNumber,
            amount: Math.ceil(amount),
            orderId,
        });

        // Send STK Push request
        const response = await fetch(
            `${MPESA_API_BASE}/mpesa/stkpush/v1/processrequest`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            }
        );

        const data = await response.json();

        console.log('STK Push Response:', data);

        // Check response code
        if (data.ResponseCode === '0') {
            return {
                success: true,
                checkoutRequestId: data.CheckoutRequestID,
                responseCode: data.ResponseCode,
                responseDescription: data.ResponseDescription,
                customerMessage: data.CustomerMessage,
            };
        } else {
            return {
                success: false,
                error: data.ResponseDescription || data.errorMessage || 'STK Push failed',
                responseCode: data.ResponseCode,
            };
        }
    } catch (error) {
        console.error('Error initiating STK Push:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}

/**
 * Query transaction status (optional - for polling)
 * Used if callback is not received
 */
export async function queryTransactionStatus(
    checkoutRequestId: string
): Promise<{ status: 'SUCCESS' | 'FAILED' | 'PENDING'; details?: any }> {
    const shortCode = mpesaConfig.shortCode;
    const passkey = mpesaConfig.passkey;

    if (!shortCode || !passkey) {
        throw new Error('M-Pesa configuration incomplete');
    }

    try {
        const accessToken = await getAccessToken();
        const timestamp = getTimestamp();
        const password = generatePassword(timestamp);

        const requestBody = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestId,
        };

        const response = await fetch(
            `${MPESA_API_BASE}/mpesa/stkpushquery/v1/query`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            }
        );

        const data = await response.json();

        // ResultCode 0 = success, non-zero = failed/pending
        if (data.ResultCode === '0') {
            return { status: 'SUCCESS', details: data };
        } else if (data.ResultCode === '1032') {
            return { status: 'PENDING', details: data };
        } else {
            return { status: 'FAILED', details: data };
        }
    } catch (error) {
        console.error('Error querying transaction status:', error);
        return { status: 'FAILED' };
    }
}

/**
 * Format phone number to M-Pesa format
 * Converts various formats to 254XXXXXXXXX
 */
export function formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // If starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
        cleaned = '254' + cleaned.substring(1);
    }

    // If starts with +254, remove +
    if (cleaned.startsWith('+254')) {
        cleaned = cleaned.substring(1);
    }

    // If doesn't start with 254, add it
    if (!cleaned.startsWith('254')) {
        cleaned = '254' + cleaned;
    }

    return cleaned;
}
