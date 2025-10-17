// Server-side auth utilities
import { auth } from "@/lib/auth"

/**
 * Check if the current user can comment
 * This requires public user authentication (not admin)
 */
export async function canUserComment() {
    const session = await auth()
    return !!session?.user?.email
}

/**
 * Get current authenticated user for commenting
 */
export async function getCurrentUser() {
    const session = await auth()
    return session?.user || null
}

/**
 * Check if user is admin (using cookie-based auth) - SERVER SIDE ONLY
 * This is separate from the public comment authentication
 */
export function isAdmin(request?: Request) {
    if (request) {
        // Server-side check
        const cookieHeader = request.headers.get("cookie")
        return cookieHeader?.includes("isLoggedIn=true") || false
    }

    return false
}