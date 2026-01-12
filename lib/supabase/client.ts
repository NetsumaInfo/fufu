import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

/**
 * Lazy Supabase Client for browser/client-side operations
 * Used for Storage uploads and real-time features
 * Instancié uniquement au runtime pour éviter les erreurs de build
 */
export function getSupabaseClient(): SupabaseClient {
    if (!supabaseInstance) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

        if (!supabaseUrl) {
            throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not configured')
        }

        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseAnonKey) {
            throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not configured')
        }

        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
            },
        })
    }

    return supabaseInstance
}

export default getSupabaseClient
