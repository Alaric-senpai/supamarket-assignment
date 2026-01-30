// Core types for the Supermarket Management System
// Re-exporting Appwrite-generated types for consistency

// Re-export Appwrite generated types
export type {
    Users,
    UsersRole,
    Products,
    Branches,
    Cart as CartTable,
    Inventory,
    Restocks,
    Orders,
    OrdersStatus,
    Payments,
    PaymentsStatus,
    OrderItems,
} from '@/types/appwrite';

// Import for use in extensions
import type {
    Inventory,
    Branches,
    Products,
    Orders,
    OrderItems,
    Payments,
    Restocks,
} from '@/types/appwrite';

// Type aliases for backward compatibility
export type { Branches as Branch } from '@/types/appwrite';
export type { Products as Product } from '@/types/appwrite';
export type { Orders as Order } from '@/types/appwrite';
export type { OrderItems as OrderItem } from '@/types/appwrite';
export type { Payments as Payment } from '@/types/appwrite';
export type { Restocks as RestockLog } from '@/types/appwrite';

// Input types for forms
export interface BranchInput {
    name: string;
    location: string;
    isHeadquarter: boolean;
    phoneNumber?: string;
}

export type UpdateBranchInput = Partial<BranchInput>;

export interface ProductInput {
    name: string;
    price: number;
    description?: string;
}

export type UpdateProductInput = Partial<ProductInput>;

// Extended types with populated relations
export interface InventoryWithRelations extends Inventory {
    branch?: Branches;
    product?: Products;
}

export interface OrderWithRelations extends Orders {
    branch?: Branches;
    items?: OrderItemWithRelations[];
    payment?: Payments;
}

export interface OrderItemWithRelations extends OrderItems {
    product?: Products;
}

export interface RestockWithRelations extends Restocks {
    branch?: Branches;
    product?: Products;
    adminName?: string;
}

// Cart types for Zustand store (client-side only)
export interface CartItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    availableStock: number;
}

export interface Cart {
    branchId: string | null;
    branchName: string | null;
    items: CartItem[];
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// M-Pesa types
export interface MpesaSTKPushRequest {
    phoneNumber: string;
    amount: number;
    orderId: string;
    accountReference: string;
}

export interface MpesaSTKPushResponse {
    success: boolean;
    checkoutRequestId?: string;
    responseCode?: string;
    responseDescription?: string;
    customerMessage?: string;
    error?: string;
}

export interface MpesaCallbackMetadata {
    Item: Array<{
        Name: string;
        Value: string | number;
    }>;
}

export interface MpesaCallbackBody {
    Body: {
        stkCallback: {
            MerchantRequestID: string;
            CheckoutRequestID: string;
            ResultCode: number;
            ResultDesc: string;
            CallbackMetadata?: MpesaCallbackMetadata;
        };
    };
}

// Sales Report types
export interface SalesSummary {
    totalUnits: number;
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    dateRange?: {
        from: string;
        to: string;
    };
}

export interface ProductSales {
    productId: string;
    productName: string;
    unitsSold: number;
    revenue: number;
    avgPrice: number;
    percentageOfTotal: number;
}

export interface BranchSales {
    branchId: string;
    branchName: string;
    unitsSold: number;
    revenue: number;
    products: Array<{
        productName: string;
        units: number;
        revenue: number;
    }>;
}

// Form validation types
export interface CreateOrderInput {
    branchId: string;
    items: Array<{
        productId: string;
        quantity: number;
    }>;
}

export interface InitiatePaymentInput {
    orderId: string;
    phoneNumber: string;
}

export interface RestockInput {
    branchId: string;
    productId: string;
    quantityAdded: number;
}

// Inventory status
export type InventoryStatus = 'CRITICAL' | 'LOW' | 'GOOD';

export interface InventoryWithStatus extends InventoryWithRelations {
    status: InventoryStatus;
}
