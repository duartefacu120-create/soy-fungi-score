"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE_NAME = "soy_fungi_user";

/**
 * Set user session cookie
 */
export async function setUserSession(email: string) {
    cookies().set(SESSION_COOKIE_NAME, email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
}

/**
 * Get current user email from session
 */
export async function getUserSession(): Promise<string | null> {
    const sessionCookie = cookies().get(SESSION_COOKIE_NAME);
    return sessionCookie?.value || null;
}

/**
 * Clear user session (logout)
 */
export async function clearUserSession() {
    cookies().delete(SESSION_COOKIE_NAME);
}

/**
 * Require authentication - throws redirect if not logged in
 */
export async function requireAuth(): Promise<string> {
    const email = await getUserSession();
    if (!email) {
        redirect("/login");
    }
    return email;
}
