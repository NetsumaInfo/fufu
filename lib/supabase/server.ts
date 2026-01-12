import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseAdminInstance: SupabaseClient | null = null

/**
 * Lazy Supabase Server Client with Service Role Key
 * Used for server-side operations that need to bypass RLS
 * (e.g., file uploads, admin operations)
 * Instancié uniquement au runtime pour éviter les erreurs de build
 *
 * NEVER expose this client to the browser!
 */
export function getSupabaseAdmin(): SupabaseClient {
    if (!supabaseAdminInstance) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

        if (!supabaseUrl) {
            throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not configured')
        }

        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseServiceKey) {
            throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not configured')
        }

        supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        })
    }

    return supabaseAdminInstance
}

export default getSupabaseAdmin
