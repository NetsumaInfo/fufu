import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/lib/auth/jwt'
import { safeError } from '@/lib/utils/errorLogger'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { username, password, rememberMe } = body

        // Validation
        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            )
        }

        // Find user by username
        const user = await prisma.user.findUnique({
            where: { username },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Don't return password
        const { password: _, ...userWithoutPassword } = user

        // Generate JWT token
        const token = await generateToken({
            userId: user.id,
            username: user.username,
            email: user.email,
        })

        // Set token in HTTP-only cookie
        const response = NextResponse.json({
            success: true,
            user: userWithoutPassword,
            token,
        })

        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // 30 days if remember me, else 7 days
            path: '/',
        })

        return response
    } catch (error) {
        safeError('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
