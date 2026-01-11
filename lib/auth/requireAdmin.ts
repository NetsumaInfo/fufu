import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'
import { prisma } from '@/lib/prisma'

/**
 * Middleware to check if user is admin
 * Use this in admin API routes
 */
export async function requireAdmin(request: NextRequest) {
    try {
        // Get token
        const token = request.cookies.get('auth-token')?.value ||
            request.headers.get('Authorization')?.replace('Bearer ', '')

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - No token provided' },
                { status: 401 }
            )
        }

        // Verify token
        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json(
                { error: 'Unauthorized - Invalid token' },
                { status: 401 }
            )
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, username: true, email: true, role: true },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            )
        }

        return { user, isAuthorized: true }
    } catch (error) {
        console.error('Admin check error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
