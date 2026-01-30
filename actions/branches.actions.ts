'use server';

import { createAdminSession } from '@/server/clients';
import { appwritecfg } from '@/config/appwrite.config';
import type { Branches, BranchInput, UpdateBranchInput } from '@/lib/types';
import { ID } from 'node-appwrite';

/**
 * Get all branches
 */
export async function getBranches(): Promise<Branches[]> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.branches,
        });

        return response.rows as unknown as Branches[];
    } catch (error) {
        console.error('Error fetching branches:', error);
        throw new Error('Failed to fetch branches');
    }
}

/**
 * Get branch by ID
 */
export async function getBranchById(branchId: string): Promise<Branches | null> {
    try {
        const { tables } = await createAdminSession();

        const branch = await tables.getRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.branches,
            rowId: branchId,
        });

        return branch as unknown as Branches;
    } catch (error) {
        console.error(`Error fetching branch ${branchId}:`, error);
        return null;
    }
}

/**
 * Get non-HQ branches (for restock selection)
 */
export async function getNonHQBranches(): Promise<Branches[]> {
    try {
        const branches = await getBranches();
        return branches.filter((branch) => !branch.isHeadquarter);
    } catch (error) {
        console.error('Error fetching non-HQ branches:', error);
        throw new Error('Failed to fetch branches');
    }
}

/**
 * Delete a branch
 */
export async function deleteBranch(branchId: string): Promise<void> {
    try {
        const { tables } = await createAdminSession();

        const branch = await tables.getRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.branches,
            rowId: branchId,
        });

        if (branch && (branch as any).isHeadquarter) {
            throw new Error('Cannot delete headquarters');
        }

        await tables.deleteRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.branches,
            rowId: branchId,
        });
    } catch (error) {
        console.error(`Error deleting branch ${branchId}:`, error);
        throw error;
    }
}

/**
 * Create a new branch
 */
export async function createBranch(data: BranchInput): Promise<Branches> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.createRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.branches,
            rowId: ID.unique(),
            data: data,
        });

        return response as unknown as Branches;
    } catch (error) {
        console.error('Error creating branch:', error);
        throw new Error('Failed to create branch');
    }
}

/**
 * Update an existing branch
 */
export async function updateBranch(branchId: string, data: UpdateBranchInput): Promise<Branches> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.updateRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.branches,
            rowId: branchId,
            data: data,
        });

        return response as unknown as Branches;
    } catch (error) {
        console.error(`Error updating branch ${branchId}:`, error);
        throw new Error('Failed to update branch');
    }
}