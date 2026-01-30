'use server'

import { createAdminSession, createClientSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";
import { ID, Query } from "node-appwrite";
import type { Users, UsersRole } from '@/lib/types';

/**
 * Create a user record in the database
 * Linked to the Appwrite Auth User ID
 */
export const createUserRecord = async (
    userId: string,
    email: string,
    name: string
) => {
    const { tables } = await createAdminSession();

    try {
        await tables.createRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.users,
            rowId: ID.unique(),
            data: {
                userId: userId,
                name: name,
                email: email,
                role: "client" // Default role
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to create user record:", error);
        // We don't throw here to avoid failing the whole auth process if just the DB record fails? 
        // Actually we probably should throw or handle it. 
        // For now returning false.
        throw error;
    }
}

/**
 * Get user role by Auth User ID
 */
export const getUserRole = async (userId: string) => {
    const { tables } = await createAdminSession();

    try {
        const userDocs = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.users,
            queries: [Query.equal("userId", userId)] // Assuming column name is 'userid' based on previous code
        });

        return userDocs.rows[0]?.role as UsersRole || "client";
    } catch (error) {
        console.error("Failed to fetch user role:", error);
        return "client"; // Fallback
    }
}


/**
 * List all users
 */
export const listUsers = async (limit: number = 25, offset: number = 0) => {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.users,
            queries: [Query.limit(limit), Query.offset(offset)]
        });

        return response.rows as unknown as Users[];
    } catch (error) {
        console.error("Failed to list users:", error);
        return [];
    }
}