'use server'

import { createAdminSession, createClientSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";
import { ID, Query } from "node-appwrite";
import { UserRole } from "@/lib/utils";

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

        return userDocs.rows[0]?.role as UserRole || "client";
    } catch (error) {
        console.error("Failed to fetch user role:", error);
        return "client"; // Fallback
    }
}


export const listAllUsers = async(limit:number=25, offset:number=0)=>{
    try {
        
        const {tables}= await createClientSession()

        const users = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.users,
            queries: [Query.limit(limit), Query.offset(offset)]
        })

        if(users){
            return {
                success: true,
                users:users.rows,
                total: users.total
            }
        }
        return {
            success: false
        }

    } catch (error) {
        return {
            success: false,
        }
    }
}