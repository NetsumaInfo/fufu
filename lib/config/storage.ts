/**
 * Configuration pour les assets (vidéos, images)
 * Utilise Cloud Storage si configuré, sinon utilise les assets locaux
 */

// URL de base pour les assets
const STORAGE_BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET || '';
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || '';

/**
 * Obtenir l'URL complète d'un asset
 * @param path - Chemin relatif de l'asset (ex: "video/Aether.webm")
 * @returns URL complète (Cloud Storage ou locale)
 */
export function getAssetUrl(path: string): string {
    // Si Cloud Storage est configuré, l'utiliser
    if (CDN_URL) {
        return `${CDN_URL}/${path}`;
    }

    // Sinon, utiliser les assets locaux
    return `/${path}`;
}

/**
 * Obtenir l'URL d'une vidéo hero
 * @param filename - Nom du fichier vidéo
 * @returns URL complète
 */
export function getVideoUrl(filename: string): string {
    return getAssetUrl(`video/${filename}`);
}

/**
 * Obtenir l'URL d'une image
 * @param path - Chemin relatif de l'image
 * @returns URL complète
 */
export function getImageUrl(path: string): string {
    return getAssetUrl(`images/${path}`);
}

// Configuration exportée
export const storageConfig = {
    bucket: STORAGE_BUCKET,
    cdnUrl: CDN_URL,
    isCloudStorage: !!CDN_URL,
} as const;
