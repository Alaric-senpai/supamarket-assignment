'use server';

import { appwritecfg } from '@/config/appwrite.config';

import { createAdminSession } from '@/server/clients';
import { Query, ID } from 'node-appwrite';
import type { Restocks, RestockInput, RestockWithRelations } from '@/lib/types';
import { getInventoryItem } from './inventory.actions';


/**
 * Restock inventory (admin only)
 * Cannot restock HQ - HQ is the source of restocks
 */
export async function restockInventory(
    adminId: string,
    input: RestockInput
): Promise<{ success: boolean; newQuantity?: number; message?: string }> {
    try {
        const { tables } = await createAdminSession();
        const { branchId, productId, quantityAdded } = input;

        // Validate inputs
        if (quantityAdded <= 0) {
            return {
                success: false,
                message: 'Quantity must be greater than 0',
            };
        }

        // Check if branch is HQ
        const branch = await tables.getRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.branches,
            rowId: branchId,
        });

        if (branch.isHeadquarter) {
            return {
                success: false,
                message: 'Cannot restock headquarters. HQ is the source of restocks.',
            };
        }

        // Get current inventory or create if doesn't exist
        let inventory = await getInventoryItem(branchId, productId);
        let previousQuantity = 0;

        if (!inventory) {
            // Create inventory record with 0 quantity
            console.log(`Creating new inventory record for branch ${branchId}, product ${productId}`);

            const newInventory = await tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.inventory,
                rowId: ID.unique(),
                data: {
                    branchId,
                    productId,
                    quantityAvailable: 0,
                },
            });

            inventory = newInventory as any;
            previousQuantity = 0;
        } else {
            previousQuantity = inventory.quantityAvailable;
        }

        const newQuantity = previousQuantity + quantityAdded;

        // Update inventory
        await tables.updateRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.inventory,
            rowId: inventory!.$id,
            data: {
                quantityAvailable: newQuantity,
                lastRestockDate: new Date().toISOString(),
            },
        });

        // Create restock log
        await tables.createRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.restockLogs,
            rowId: ID.unique(),
            data: {
                adminId,
                branchId,
                productId,
                quantityAdded,
                previousQuantity,
                newQuantity,
            },
        });

        console.log(
            `Restock completed: Branch ${branchId}, Product ${productId}, Added ${quantityAdded}, New total: ${newQuantity}`
        );

        return {
            success: true,
            newQuantity,
            message: `Successfully restocked. New quantity: ${newQuantity}`,
        };
    } catch (error) {
        console.error('Error restocking inventory:', error);
        return {
            success: false,
            message: 'Failed to restock inventory',
        };
    }
}

/**
 * Get restock history
 * Optionally filter by branch
 */
export async function getRestockHistory(
    branchId?: string,
    limit: number = 50
): Promise<RestockWithRelations[]> {
    try {
        const { tables } = await createAdminSession();

        const queries = [Query.orderDesc('$createdAt'), Query.limit(limit)];

        if (branchId) {
            queries.push(Query.equal('branchId', branchId));
        }

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.restockLogs,
            queries,
        });

        // Populate branch and product details
        const logsWithDetails = await Promise.all(
            response.rows.map(async (log: any) => {
                const [branch, product] = await Promise.all([
                    tables.getRow({
                        databaseId: appwritecfg.databaseId,
                        tableId: appwritecfg.tables.branches,
                        rowId: log.branchId,
                    }),
                    tables.getRow({
                        databaseId: appwritecfg.databaseId,
                        tableId: appwritecfg.tables.products,
                        rowId: log.productId,
                    }),
                ]);

                return {
                    ...log,
                    branch,
                    product,
                } as unknown as RestockWithRelations;
            })
        );

        return logsWithDetails;
    } catch (error) {
        console.error('Error fetching restock history:', error);
        throw new Error('Failed to fetch restock history');
    }
}

/**
 * Get restock logs for a specific product
 */
export async function getProductRestockHistory(
    productId: string,
    limit: number = 20
): Promise<RestockWithRelations[]> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.restockLogs,
            queries: [
                Query.equal('productId', productId),
                Query.orderDesc('$createdAt'),
                Query.limit(limit),
            ],
        });

        // Populate branch details
        const logsWithDetails = await Promise.all(
            response.rows.map(async (log: any) => {
                const [branch, product] = await Promise.all([
                    tables.getRow({
                        databaseId: appwritecfg.databaseId,
                        tableId: appwritecfg.tables.branches,
                        rowId: log.branchId,
                    }),
                    tables.getRow({
                        databaseId: appwritecfg.databaseId,
                        tableId: appwritecfg.tables.products,
                        rowId: log.productId,
                    }),
                ]);

                return {
                    ...log,
                    branch,
                    product,
                } as unknown as RestockWithRelations;
            })
        );

        return logsWithDetails;
    } catch (error) {
        console.error(`Error fetching restock history for product ${productId}:`, error);
        throw new Error('Failed to fetch product restock history');
    }
}
