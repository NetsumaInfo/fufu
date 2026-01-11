import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Supabase Server Client with Service Role Key
 * Used for server-side operations that need to bypass RLS
 * (e.g., file uploads, admin operations)
 * 
 * NEVER expose this client to the browser!
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

export default supabaseAdmin
