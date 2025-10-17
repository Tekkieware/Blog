/**
 * Utility functions for comment handling
 */

/**
 * Basic text sanitization for comments
 * Removes dangerous HTML/script tags while preserving line breaks
 */
export function sanitizeCommentContent(content: string): string {
    return content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim()
}

/**
 * Format comment content for display
 * Converts line breaks to proper formatting
 */
export function formatCommentContent(content: string): string {
    return content
        .replace(/\n\n/g, '\n\n') // Preserve paragraph breaks
        .trim()
}

/**
 * Validate comment content
 */
export function validateComment(content: string, maxLength: number = 2000): {
    isValid: boolean
    error?: string
} {
    if (!content.trim()) {
        return { isValid: false, error: 'Comment cannot be empty' }
    }

    if (content.length > maxLength) {
        return { isValid: false, error: `Comment cannot exceed ${maxLength} characters` }
    }

    return { isValid: true }
}

/**
 * Validate user name
 */
export function validateUserName(name: string): {
    isValid: boolean
    error?: string
} {
    if (!name.trim()) {
        return { isValid: false, error: 'Name is required' }
    }

    if (name.length > 50) {
        return { isValid: false, error: 'Name cannot exceed 50 characters' }
    }

    // Basic name validation - no special characters except spaces, hyphens, apostrophes
    if (!/^[a-zA-Z\s\-'\.]+$/.test(name)) {
        return { isValid: false, error: 'Name contains invalid characters' }
    }

    return { isValid: true }
}

/**
 * Get user avatar initials from name
 */
export function getAvatarInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
}

/**
 * Generate a simple color based on email for consistent user colors
 */
export function getUserColor(email: string): string {
    const colors = [
        'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
        'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ]

    const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
}