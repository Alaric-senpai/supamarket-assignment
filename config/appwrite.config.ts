/**
 * centralised access point to appwrite ids and configurations eg like database ids etc
 * 
 */
export const appwritecfg = {
    project: {
        id: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
        endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
        apikey: process.env.APPWRITE_API_KEY!
    },
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    tables: {
        users: process.env.NEXT_PUBLIC_APPWRITE_USERS_TABLE_ID!
    }
}