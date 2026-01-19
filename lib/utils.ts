import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const ROLE_COOKIE = "user_role";
export const SESSION_COOKIE = 'user_session';


export type UserRole = "admin"|"client"
