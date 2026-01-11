/**
 * JWT Token utilities for authentication
 * Uses jsonwebtoken for secure HMAC-SHA256 signing
 */

import jwt from 'jsonwebtoken'

export interface TokenPayload {
    userId: string
    username: string
    email: string
}

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET must be set and at least 32 characters long')
    }
    return secret
}

/**
 * Generate a secure JWT token with HMAC-SHA256 signature
 */
export function generateToken(payload: TokenPayload): string {
    const secret = getJwtSecret()

    return jwt.sign(payload, secret, {
        algorithm: 'HS256',
        expiresIn: '7d',
    })
}

/**
 * Verify and decode token with cryptographic signature verification
 */
export function verifyToken(token: string): TokenPayload | null {
    try {
        const secret = getJwtSecret()
        const decoded = jwt.verify(token, secret, {
            algorithms: ['HS256'],
        }) as TokenPayload & { iat: number; exp: number }

        return {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email,
        }
    } catch {
        return null
    }
}
