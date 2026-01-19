'use server'

import { appwritecfg } from "@/config/appwrite.config";
import { Account, Avatars, Client, Databases, Functions, Health, Messaging, Sites, Storage, TablesDB, Teams, Tokens, Users } from "node-appwrite"
import { getUserSessionCookie } from "../cookies";

interface AppwriteSession {
    // responsible for accourts amangement
    accounts: Account;
    teams:Teams;
    users:Users;
    databases:Databases;
    tables:TablesDB;
    storage: Storage;
    health:Health;
    avatars:Avatars;
    messaging:Messaging;
    sites:Sites;
    tokens:Tokens;
    functions: Functions;

}

/**
 * 
 * admin session used for operation running on the api key
 * 
 */
export const createAdminSession = async():Promise<AppwriteSession>=>{

    const cli = new Client()
    .setProject(appwritecfg.project.id)
    .setEndpoint(appwritecfg.project.endpoint)
    .setKey(appwritecfg.project.apikey)

    return {
        /**
         * handle all account related stuff from registration to sessions etc
         */
        get accounts(){
            return new Account(cli)
        },
        /**
         * team management functionality
         */
        get teams(){
            return new Teams(cli)
        },
        /**
         * appwrite functions management functionality
         */
        get functions(){
            return new Functions(cli)
        },
        /**
         * appwrite sites management functionality
         */
        get sites(){
            return new Sites(cli)
        },
        /**
         * appwrite projects health management
         */
        get health(){
            return new Health(cli)
        },
        /**
         * messaging functionality
         */
        get messaging(){
            return new Messaging(cli)
        },
        /**
         * tokens functionality
         */
        get tokens(){
            return new Tokens(cli)
        },
        /**
         * users management
         */
        get users(){
            return new Users(cli)
        },
        /** 
         * avatars management
         */
        get avatars(){
            return new Avatars(cli)
        },
        /**
         * databases management -- legacy databases--switch to new tables.
         * still works okay but I reccomend you use tables db gives more control on document permissions and some other stuff
         */
        get databases(){
            return new Databases(cli)
        },
        /**
         * 
         * file storage functionality
         * 
         */
        get storage(){
            return new Storage(cli)
        },
        /**
         * 
         * new tables api works to store docs like databases but more control on records permissions
         * 
         */
        get tables(){
            return new TablesDB(cli)
        }

        
    }

}



/**
 * session for performing operations with authenticated user
 * 
 */
export const createClientSession = async():Promise<AppwriteSession>=>{


    const user_session = await getUserSessionCookie()

    if(!user_session){
        throw new Error("This action requires you to be logged in")
    }

    const cli = new Client()
    .setProject(appwritecfg.project.id)
    .setEndpoint(appwritecfg.project.endpoint)
    .setSession(user_session)

    return {
        /**
         * handle all account related stuff from registration to sessions etc
         */
        get accounts(){
            return new Account(cli)
        },
        /**
         * team management functionality
         */
        get teams(){
            return new Teams(cli)
        },
        /**
         * appwrite functions management functionality
         */
        get functions(){
            return new Functions(cli)
        },
        /**
         * appwrite sites management functionality
         */
        get sites(){
            return new Sites(cli)
        },
        /**
         * appwrite projects health management
         */
        get health(){
            return new Health(cli)
        },
        /**
         * messaging functionality
         */
        get messaging(){
            return new Messaging(cli)
        },
        /**
         * tokens functionality
         */
        get tokens(){
            return new Tokens(cli)
        },
        /**
         * users management
         */
        get users(){
            return new Users(cli)
        },
        /** 
         * avatars management
         */
        get avatars(){
            return new Avatars(cli)
        },
        /**
         * databases management -- legacy databases--switch to new tables.
         * still works okay but I reccomend you use tables db gives more control on document permissions and some other stuff
         */
        get databases(){
            return new Databases(cli)
        },
        /**
         * 
         * file storage functionality
         * 
         */
        get storage(){
            return new Storage(cli)
        },
        /**
         * 
         * new tables api works to store docs like databases but more control on records permissions
         * 
         */
        get tables(){
            return new TablesDB(cli)
        }

        
    }
}