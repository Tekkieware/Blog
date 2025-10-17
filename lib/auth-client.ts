// Client-side auth utilities
// These functions are safe to use in client components

/**
 * Check if user is admin on client side only
 * Uses cookie-based authentication check
 */
export function isAdminClient() {
    if (typeof window === "undefined") return false
    return document.cookie.includes("isLoggedIn=true")
}

/**
 * Check if current user session matches an email
 */
export function isCurrentUserEmail(sessionEmail: string | null | undefined, targetEmail: string) {
    return sessionEmail === targetEmail
}