import { createAdminSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";
import { setSessionCookie, setRoleCookie } from "@/server/cookies";
import { Client, Account, Query } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";
import { createUserRecord, getUserRole } from "@/actions/user.actions";

export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get("userId");
    const secret = request.nextUrl.searchParams.get("secret");

    // Validate required parameters
    if (!userId || !secret) {
        console.error("OAuth Error: Missing parameters", { userId: !!userId, secret: !!secret });
        return NextResponse.redirect(
            `${request.nextUrl.origin}/fail?error=oauth_missing_params`
        );
    }

    try {
        // 1. Initialize Client with the OAuth secret to verify session
        const client = new Client()
            .setEndpoint(appwritecfg.project.endpoint)
            .setProject(appwritecfg.project.id)
            .setSession(secret);

        const account = new Account(client);
        
        // 2. Get user details to verify the session is valid
        let user;
        try {
            user = await account.get();
        } catch (error: any) {
            console.error("OAuth Error: Failed to get user", error);
            return NextResponse.redirect(
                `${request.nextUrl.origin}/fail?error=oauth_invalid_session`
            );
        }

        // 3. Verify userId matches
        if (user.$id !== userId) {
            console.error("OAuth Error: User ID mismatch", { 
                expected: userId, 
                received: user.$id 
            });
            return NextResponse.redirect(
                `${request.nextUrl.origin}/fail?error=oauth_user_mismatch`
            );
        }

        // 4. Check/Create DB Record
        const { tables } = await createAdminSession();
        let role = "client";

        try {
            const userDocs = await tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                queries: [Query.equal("userId", userId)]
            });

            if (userDocs.total === 0) {
                // User doesn't exist in DB -> Create Record
                console.log("Creating new user record for OAuth user:", userId);
                await createUserRecord(
                    userId, 
                    user.email || '', 
                    user.name || 'User'
                );
            } else {
                // User exists -> Get Role
                role = userDocs.rows[0].role || "client";
            }
        } catch (dbError: any) {
            console.error("OAuth Error: Database operation failed", dbError);
            // Continue with default role even if DB operation fails
            // This ensures auth flow continues
        }

        // 5. Set Authentication Cookies
        try {
            await setSessionCookie(secret);
            await setRoleCookie(role as "client" | "admin");
        } catch (cookieError: any) {
            console.error("OAuth Error: Failed to set cookies", cookieError);
            return NextResponse.redirect(
                `${request.nextUrl.origin}/fail?error=oauth_cookie_failed`
            );
        }

        // 6. Successful authentication - redirect to success page then dashboard
        console.log("OAuth Success: User authenticated", { userId, role });
        return NextResponse.redirect(`${request.nextUrl.origin}/success`);

    } catch (error: any) {
        console.error("OAuth Callback Error:", {
            message: error?.message,
            type: error?.type,
            code: error?.code,
            userId,
        });

        // Determine specific error type
        let errorType = "oauth_callback_failed";
        
        if (error?.code === 401 || error?.type === 'user_unauthorized') {
            errorType = "oauth_unauthorized";
        } else if (error?.code === 404) {
            errorType = "oauth_user_not_found";
        } else if (error?.message?.includes('network')) {
            errorType = "oauth_network_error";
        }

        return NextResponse.redirect(
            `${request.nextUrl.origin}/fail?error=${errorType}`
        );
    }
}
