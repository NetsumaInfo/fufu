import { getSupabaseAdmin } from './server'

// Bucket name - PRIVATE bucket
const BUCKET_NAME = 'avatars'

// Signed URL expiration time (1 hour in seconds)
const SIGNED_URL_EXPIRY = 3600

/**
 * Upload avatar to Supabase Storage (Private Bucket)
 * @param userId - User ID for unique filename
 * @param file - Compressed image file (max 100KB)
 * @returns File path in storage (not URL, since bucket is private)
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
    const fileExt = 'jpg' // Always JPEG from our compression
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `${userId}/${fileName}` // Organize by user ID

    // Upload to Supabase Storage (private bucket)
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        })

    if (error) {
        console.error('Error uploading avatar:', error)
        throw new Error('Failed to upload avatar')
    }

    // Return the file path (we'll generate signed URLs when needed)
    return filePath
}

/**
 * Upload avatar from base64 data URL (for migration)
 * @param userId - User ID
 * @param dataUrl - Base64 data URL
 * @returns File path in storage
 */
export async function uploadAvatarFromDataUrl(userId: string, dataUrl: string): Promise<string> {
    // Convert base64 to blob
    const base64Response = await fetch(dataUrl)
    const blob = await base64Response.blob()

    const fileName = `${userId}-${Date.now()}.jpg`
    const filePath = `${userId}/${fileName}`

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, blob, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'image/jpeg',
        })

    if (error) {
        console.error('Error uploading avatar:', error)
        throw new Error('Failed to upload avatar')
    }

    return filePath
}

/**
 * Get a signed URL for a private avatar
 * The URL will expire after SIGNED_URL_EXPIRY seconds
 * @param filePath - File path in storage
 * @returns Signed URL (temporary access)
 */
export async function getAvatarSignedUrl(filePath: string): Promise<string | null> {
    if (!filePath) return null

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(filePath, SIGNED_URL_EXPIRY)

    if (error) {
        console.error('Error creating signed URL:', error)
        return null
    }

    return data.signedUrl
}

/**
 * Get multiple signed URLs at once (for lists of users)
 * @param filePaths - Array of file paths
 * @returns Array of signed URLs
 */
export async function getAvatarSignedUrls(filePaths: string[]): Promise<(string | null)[]> {
    const validPaths = filePaths.filter(p => p)

    if (validPaths.length === 0) {
        return filePaths.map(() => null)
    }

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrls(validPaths, SIGNED_URL_EXPIRY)

    if (error) {
        console.error('Error creating signed URLs:', error)
        return filePaths.map(() => null)
    }

    // Map back to original order with nulls for missing paths
    const urlMap = new Map(data.map(item => [item.path, item.signedUrl]))
    return filePaths.map(path => path ? urlMap.get(path) || null : null)
}

/**
 * Delete old avatar from Storage
 * @param filePath - File path in storage (not URL)
 */
export async function deleteAvatar(filePath: string): Promise<void> {
    if (!filePath) return

    try {
        const supabase = getSupabaseAdmin()
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath])

        if (error) {
            console.error('Error deleting avatar:', error)
            // Don't throw - it's okay if deletion fails
        }
    } catch (error) {
        console.error('Error deleting avatar:', error)
    }
}

/**
 * Extract file path from a signed URL (for deletion)
 * @param signedUrl - The signed URL
 * @returns File path or null
 */
export function extractFilePathFromUrl(signedUrl: string): string | null {
    try {
        const url = new URL(signedUrl)
        // Signed URLs have the path after /object/sign/bucket-name/
        const match = url.pathname.match(/\/object\/sign\/[^/]+\/(.+)/)
        return match ? match[1] : null
    } catch {
        return null
    }
}
