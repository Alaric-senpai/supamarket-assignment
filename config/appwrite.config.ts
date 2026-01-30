/**
 * Centralized access point to Appwrite IDs and configurations
 * All environment variables are accessed from here
 */
export const appwritecfg = {
    project: {
        id: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
        endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
        apikey: process.env.APPWRITE_API_KEY!,
    },
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    tables: {
        users: process.env.NEXT_PUBLIC_APPWRITE_USERS_TABLE_ID!,
        branches: process.env.APPWRITE_BRANCHES_COLLECTION_ID!,
        products: process.env.APPWRITE_PRODUCTS_COLLECTION_ID!,
        inventory: process.env.APPWRITE_INVENTORY_COLLECTION_ID!,
        orders: process.env.APPWRITE_ORDERS_COLLECTION_ID!,
        orderItems: process.env.APPWRITE_ORDER_ITEMS_COLLECTION_ID!,
        payments: process.env.APPWRITE_PAYMENTS_COLLECTION_ID!,
        restockLogs: process.env.APPWRITE_RESTOCK_LOGS_COLLECTION_ID!,
    },
};

/**
 * M-Pesa configuration
 */
export const mpesaConfig = {
    consumerKey: process.env.MPESA_CONSUMER_KEY!,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
    shortCode: process.env.MPESA_SHORT_CODE!,
    passkey: process.env.MPESA_PASSKEY!,
    callbackUrl: process.env.MPESA_CALLBACK_URL!,
    environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
};

/**
 * Application configuration
 */
export const appConfig = {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};