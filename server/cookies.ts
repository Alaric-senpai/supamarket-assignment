'use server'




import { ROLE_COOKIE, SESSION_COOKIE, UserRole } from "@/lib/utils";
import { cookies } from "next/headers";


/**
 * 
 * set cookie
 * 
 * @param name 
 * @param value 
 * @param config 
 */
export const setCookie = async(name:string, value:any ,config?:Record<string, any> )=>{

    const cookiestore = await cookies()
    cookiestore.set(name, value, {
        ...config,
        maxAge: 60 * 60 * 30 *1000,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        httpOnly: true
    })

}


/**
 * Delete cookie by name
 * 
 * @param name 
 */
export const deleteCookie = async(name:string)=>{
    const cookiestore = await cookies()
    cookiestore.delete(name)
}

/**
 * Get the value of a cookie
 * 
 * @param name cookie
 * @returns 
 */
export const getCookie = async(name:string):Promise<string| undefined> =>{
    const store = await cookies();
    return store.get(name)?.value
}

/**
 * fetch all available cookies and return them
 * 
 * @returns list of all avaliable cookies
 */
export const getAllCookies = async()=>{
    const store = await cookies()
    return store.getAll()
}

/**
 * confirm if a cookie exists 
 * 
 * @param name - name of cookie you are looking for
 * @returns boolean
 * 
 */
export const isCookieAvailable = async(name:string)=>{
    const store = await cookies()
    return store.has(name)
}

/**
 * set the user session cookie
 * 
 * @param value 
 */
export const setSessionCookie = async(value:string)=>{
    await setCookie(SESSION_COOKIE, value)
}

/**
 * delete user session cookie
 */
export const deleteSessionCookie = async()=>{
    await deleteCookie(SESSION_COOKIE)
}

/**
 * 
 * get the logged in user session secret
 * 
 * @returns 
 */
export const getUserSessionCookie = async()=>{
    return getCookie(SESSION_COOKIE)
}

/**
 * 
 * set the role cookie
 * 
 * @param value 
 */
export const setRoleCookie = async(value:UserRole)=>{
    await setCookie(ROLE_COOKIE, value)
}

/**
 * delete the role cookie
 */
export const deleteRoleCookie = async()=>{
    await deleteCookie(ROLE_COOKIE)
}

/**
 * get the saved user role
 */
export const getRoleCookie = async()=>{
   return await getCookie(ROLE_COOKIE)
}