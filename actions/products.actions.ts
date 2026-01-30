'use server';

import { createAdminSession } from '@/server/clients';
import { appwritecfg } from '@/config/appwrite.config';
import type { Products, ProductInput, UpdateProductInput } from '@/lib/types';
import { ID, Query } from 'node-appwrite';

/**
 * Get all products
 */
export async function getProducts(): Promise<Products[]> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.products,
        });

        return response.rows as unknown as Products[];
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
}

/**
 * Get product by ID
 */
export async function getProductById(productId: string): Promise<Products | null> {
    try {
        const { tables } = await createAdminSession();

        const product = await tables.getRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.products,
            rowId: productId,
        });

        return product as unknown as Products;
    } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
        return null;
    }
}

/**
 * Get product price
 * Helper function for order calculations
 */
export async function getProductPrice(productId: string): Promise<number> {
    const product = await getProductById(productId);
    if (!product) {
        throw new Error(`Product ${productId} not found`);
    }
    return parseFloat(product.price);
}

/**
 * Create a new product
 */
export async function createProduct(data: ProductInput): Promise<Products> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.createRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.products,
            rowId: ID.unique(),
            data: {
                ...data,
                price: data.price.toString(),
            },
        });

        return response as unknown as Products;
    } catch (error) {
        console.error('Error creating product:', error);
        throw new Error('Failed to create product');
    }
}

/**
 * Update an existing product
 */
export async function updateProduct(productId: string, data: UpdateProductInput): Promise<Products> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.updateRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.products,
            rowId: productId,
            data: {
                ...data,
                price: data.price?.toString(),
            },
        });

        return response as unknown as Products;
    } catch (error) {
        console.error(`Error updating product ${productId}:`, error);
        throw new Error('Failed to update product');
    }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string): Promise<void> {
    try {
        const { tables } = await createAdminSession();

        // Check if product is in any active orders or inventory
        // (This is a simplified check, in a real app you might want more robust cascading/blocking)
        const inventoryResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.inventory,
            queries: [Query.equal('productId', productId)],
        });

        if (inventoryResponse.rows.length > 0) {
            throw new Error('Cannot delete product that has existing inventory records');
        }

        await tables.deleteRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.products,
            rowId: productId,
        });
    } catch (error) {
        console.error(`Error deleting product ${productId}:`, error);
        throw error;
    }
}
