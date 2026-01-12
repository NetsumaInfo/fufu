import { Resend } from 'resend'

/**
 * Lazy Resend Client Singleton
 * Instancié uniquement au runtime pour éviter les erreurs de build
 */
let resendInstance: Resend | null = null

export function getResendClient(): Resend {
    if (!resendInstance) {
        const apiKey = process.env.RESEND_API_KEY

        if (!apiKey) {
            throw new Error('RESEND_API_KEY environment variable is not configured')
        }

        resendInstance = new Resend(apiKey)
    }

    return resendInstance
}

export function getResendFromEmail(): string {
    return process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
}
