'use server';

import { createAdminSession } from '@/server/clients';
import { Query, ID } from 'node-appwrite';
import { appwritecfg } from '@/config/appwrite.config';

/**
 * Initialize inventory for all products across all branches
 * Creates inventory records with 0 quantity if they don't exist
 */
export async function initializeInventory(): Promise<{ success: boolean; message: string; created: number }> {
    try {
        const { tables } = await createAdminSession();

        // Get all branches
        const branchesResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.branches,
        });

        // Get all products
        const productsResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.products,
        });

        let created = 0;

        // For each branch-product combination, ensure inventory record exists
        for (const branch of branchesResponse.rows) {
            for (const product of productsResponse.rows) {
                // Check if inventory record exists
                const existingInventory = await tables.listRows({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.inventory,
                    queries: [
                        Query.equal('branchId', branch.$id),
                        Query.equal('productId', product.$id),
                    ],
                });

                // Create if doesn't exist
                if (existingInventory.rows.length === 0) {
                    await tables.createRow({
                        databaseId: appwritecfg.databaseId,
                        tableId: appwritecfg.tables.inventory,
                        rowId: ID.unique(),
                        data: {
                            branchId: branch.$id,
                            productId: product.$id,
                            quantityAvailable: 0,
                        },
                    });
                    created++;
                }
            }
        }

        console.log(`Inventory initialization complete. Created ${created} new inventory records.`);

        return {
            success: true,
            message: `Inventory initialized successfully. Created ${created} new records.`,
            created,
        };
    } catch (error) {
        console.error('Error initializing inventory:', error);
        return {
            success: false,
            message: 'Failed to initialize inventory',
            created: 0,
        };
    }
}

/**
 * Ensure inventory record exists for a specific branch-product combination
 * Creates it with 0 quantity if it doesn't exist
 */
export async function ensureInventoryExists(
    branchId: string,
    productId: string
): Promise<{ success: boolean; inventoryId: string; created: boolean }> {
    try {
        const { tables } = await createAdminSession();

        // Check if inventory record exists
        const existingInventory = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.inventory,
            queries: [
                Query.equal('branchId', branchId),
                Query.equal('productId', productId),
            ],
        });

        if (existingInventory.rows.length > 0) {
            return {
                success: true,
                inventoryId: existingInventory.rows[0].$id,
                created: false,
            };
        }

        // Create new inventory record
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

        console.log(`Created new inventory record for branch ${branchId}, product ${productId}`);

        return {
            success: true,
            inventoryId: newInventory.$id,
            created: true,
        };
    } catch (error) {
        console.error(`Error ensuring inventory exists for branch ${branchId}, product ${productId}:`, error);
        throw error;
    }
}
