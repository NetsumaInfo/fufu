/**
 * Image processing utilities for avatar upload
 * Handles resize, compression, and validation
 */

// Maximum file size for upload (2MB)
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

// Target dimensions for avatar
export const AVATAR_SIZE = 400; // 400x400 pixels (higher quality)

// Maximum compressed size (increased for better quality)
export const MAX_COMPRESSED_SIZE = 300 * 1024; // 300KB

/**
 * Validates file type and size
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        return { valid: false, error: 'Format non supporté. Utilisez JPG, PNG, WebP ou GIF.' };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
        return { valid: false, error: `Le fichier est trop volumineux. Maximum ${sizeMB}MB.` };
    }

    return { valid: true };
}

/**
 * Loads an image from a File object
 */
function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Resizes and compresses an image to a square avatar
 * Returns a base64 data URL
 */
export async function processAvatarImage(file: File): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
        // Validate first
        const validation = validateImageFile(file);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

        // Load the image
        const img = await loadImage(file);

        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        canvas.width = AVATAR_SIZE;
        canvas.height = AVATAR_SIZE;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return { success: false, error: 'Erreur de traitement de l\'image.' };
        }

        // Calculate crop dimensions for square aspect ratio (center crop)
        const minDimension = Math.min(img.width, img.height);
        const sx = (img.width - minDimension) / 2;
        const sy = (img.height - minDimension) / 2;

        // Draw the cropped and resized image
        ctx.drawImage(
            img,
            sx, sy, minDimension, minDimension, // Source (cropped area)
            0, 0, AVATAR_SIZE, AVATAR_SIZE      // Destination (full canvas)
        );

        // Clean up object URL
        URL.revokeObjectURL(img.src);

        // Compress to JPEG with quality adjustment
        let quality = 0.9;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Reduce quality if still too large
        while (dataUrl.length > MAX_COMPRESSED_SIZE * 1.37 && quality > 0.3) { // 1.37 accounts for base64 overhead
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        return { success: true, data: dataUrl };
    } catch (error) {
        console.error('Error processing image:', error);
        return { success: false, error: 'Erreur lors du traitement de l\'image.' };
    }
}
