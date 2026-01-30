'use server';

import { createAdminSession } from '@/server/clients';
import { Query } from 'node-appwrite';
import { appwritecfg } from '@/config/appwrite.config';
import type { Inventory, InventoryWithStatus, InventoryWithRelations } from '@/lib/types';

/**
 * Get inventory for a specific branch
 */
export async function getBranchInventory(branchId: string): Promise<InventoryWithRelations[]> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.inventory,
            queries: [Query.equal('branchId', branchId)],
        });

        // Populate product details for each inventory item
        const inventoryWithProducts = await Promise.all(
            response.rows.map(async (inv: any) => {
                const product = await tables.getRow({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.products,
                    rowId: inv.productId,
                });

                return {
                    ...inv,
                    product: product,
                } as unknown as InventoryWithRelations;
            })
        );

        return inventoryWithProducts;
    } catch (error) {
        console.error(`Error fetching inventory for branch ${branchId}:`, error);
        throw new Error('Failed to fetch inventory');
    }
}

/**
 * Get all inventory across all branches
 */
export async function getAllInventory(): Promise<InventoryWithStatus[]> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.inventory,
            queries: [Query.limit(100)],
        });

        // Populate branch and product details
        const inventoryWithDetails = await Promise.all(
            response.rows.map(async (inv: any) => {
                const [branch, product] = await Promise.all([
                    tables.getRow({
                        databaseId: appwritecfg.databaseId,
                        tableId: appwritecfg.tables.branches,
                        rowId: inv.branchId,
                    }),
                    tables.getRow({
                        databaseId: appwritecfg.databaseId,
                        tableId: appwritecfg.tables.products,
                        rowId: inv.productId,
                    }),
                ]);

                // Determine status based on quantity
                let status: 'CRITICAL' | 'LOW' | 'GOOD';
                if (inv.quantityAvailable < 100) {
                    status = 'CRITICAL';
                } else if (inv.quantityAvailable < 200) {
                    status = 'LOW';
                } else {
                    status = 'GOOD';
                }

                return {
                    ...inv,
                    branch,
                    product,
                    status,
                } as unknown as InventoryWithStatus;
            })
        );

        return inventoryWithDetails;
    } catch (error) {
        console.error('Error fetching all inventory:', error);
        throw new Error('Failed to fetch inventory');
    }
}

/**
 * Get inventory for a specific product at a specific branch
 */
export async function getInventoryItem(
    branchId: string,
    productId: string
): Promise<Inventory | null> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.inventory,
            queries: [
                Query.equal('branchId', branchId),
                Query.equal('productId', productId),
            ],
        });

        if (response.rows.length === 0) {
            return null;
        }

        return response.rows[0] as unknown as Inventory;
    } catch (error) {
        console.error(
            `Error fetching inventory for branch ${branchId}, product ${productId}:`,
            error
        );
        return null;
    }
}

/**
 * Validate if sufficient stock is available
 * Returns true if stock is available, false otherwise
 */
export async function validateStock(
    branchId: string,
    productId: string,
    requestedQuantity: number
): Promise<{ valid: boolean; available: number; message?: string }> {
    try {
        const inventory = await getInventoryItem(branchId, productId);

        if (!inventory) {
            return {
                valid: false,
                available: 0,
                message: 'Product not found in this branch',
            };
        }

        if (inventory.quantityAvailable < requestedQuantity) {
            return {
                valid: false,
                available: inventory.quantityAvailable,
                message: `Insufficient stock. Only ${inventory.quantityAvailable} units available`,
            };
        }

        return {
            valid: true,
            available: inventory.quantityAvailable,
        };
    } catch (error) {
        console.error('Error validating stock:', error);
        return {
            valid: false,
            available: 0,
            message: 'Error checking stock availability',
        };
    }
}

/**
 * Deduct inventory after successful payment
 * This should only be called after payment is confirmed
 */
export async function deductInventory(
    branchId: string,
    productId: string,
    quantity: number
): Promise<{ success: boolean; message?: string }> {
    try {
        const { tables } = await createAdminSession();

        // Get current inventory
        const inventory = await getInventoryItem(branchId, productId);

        if (!inventory) {
            return {
                success: false,
                message: 'Inventory record not found',
            };
        }

        // Check if sufficient stock
        if (inventory.quantityAvailable < quantity) {
            return {
                success: false,
                message: `Insufficient stock. Only ${inventory.quantityAvailable} units available`,
            };
        }

        // Calculate new quantity
        const newQuantity = inventory.quantityAvailable - quantity;

        // Update inventory
        await tables.updateRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.inventory,
            rowId: inventory.$id,
            data: {
                quantityAvailable: newQuantity,
            },
        });

        console.log(
            `Inventory deducted: Branch ${branchId}, Product ${productId}, Quantity ${quantity}`
        );

        return {
            success: true,
            message: `Stock updated. New quantity: ${newQuantity}`,
        };
    } catch (error) {
        console.error('Error deducting inventory:', error);
        return {
            success: false,
            message: 'Failed to update inventory',
        };
    }
}

/**
 * Get low stock alerts (quantity < 100)
 */
export async function getLowStockAlerts(): Promise<InventoryWithStatus[]> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.inventory,
            queries: [Query.lessThan('quantityAvailable', 100), Query.limit(50)],
        });

        // Populate details
        const alertsWithDetails = await Promise.all(
            response.rows.map(async (inv: any) => {
                const [branch, product] = await Promise.all([
                    tables.getRow({
                        databaseId: appwritecfg.databaseId,
                        tableId: appwritecfg.tables.branches,
                        rowId: inv.branchId,
                    }),
                    tables.getRow({
                        databaseId: appwritecfg.databaseId,
                        tableId: appwritecfg.tables.products,
                        rowId: inv.productId,
                    }),
                ]);

                return {
                    ...inv,
                    branch,
                    product,
                    status: 'CRITICAL' as const,
                } as unknown as InventoryWithStatus;
            })
        );

        return alertsWithDetails;
    } catch (error) {
        console.error('Error fetching low stock alerts:', error);
        throw new Error('Failed to fetch low stock alerts');
    }
}
