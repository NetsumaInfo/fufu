/**
 * JWT Token utilities for authentication
 * Uses jose for secure HMAC-SHA256 signing (edge runtime compatible)
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

export interface TokenPayload extends JWTPayload {
    userId: string
    username: string
    email: string
}

const getJwtSecret = (): Uint8Array => {
    const secret = process.env.JWT_SECRET
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET must be set and at least 32 characters long')
    }
    // Convert secret string to Uint8Array for jose
    return new TextEncoder().encode(secret)
}

/**
 * Generate a secure JWT token with HMAC-SHA256 signature
 */
export async function generateToken(payload: TokenPayload): Promise<string> {
    const secret = getJwtSecret()

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret)
}

/**
 * Verify and decode token with cryptographic signature verification
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const secret = getJwtSecret()
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ['HS256'],
        })

        return {
            userId: payload.userId as string,
            username: payload.username as string,
            email: payload.email as string,
        }
    } catch {
        return null
    }
}
