import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth/jwt'
import { uploadAvatarFromDataUrl, deleteAvatar, getAvatarSignedUrl } from '@/lib/supabase/storage'
import bcrypt from 'bcryptjs'
import { safeError } from '@/lib/utils/errorLogger'

// GET - Get user profile
export async function GET(request: NextRequest) {
    try {
        // Get token from cookie or Authorization header
        const token = request.cookies.get('auth-token')?.value ||
            request.headers.get('Authorization')?.replace('Bearer ', '')

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Verify token
        const payload = await verifyToken(token)
        if (!payload) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            )
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Don't return password
        const { password: _, ...userWithoutPassword } = user

        // Generate signed URL for avatar if exists (private bucket)
        let avatarUrl = null
        if (user.avatar) {
            avatarUrl = await getAvatarSignedUrl(user.avatar)
        }

        return NextResponse.json({
            success: true,
            user: {
                ...userWithoutPassword,
                avatarUrl, // Temporary signed URL for display
            },
        })
    } catch (error) {
        safeError('Get profile error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
    try {
        // Get token
        const token = request.cookies.get('auth-token')?.value ||
            request.headers.get('Authorization')?.replace('Bearer ', '')

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Verify token
        const payload = await verifyToken(token)
        if (!payload) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const {
            username,
            email,
            avatar, // base64 data URL
            country,
            age,
            gender,
            team,
            youtubeLink,
            discordId,
            twitter,
            bluesky,
        } = body

        // Check if username/email is taken by another user
        if (username || email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    AND: [
                        { id: { not: payload.userId } },
                        {
                            OR: [
                                username ? { username } : {},
                                email ? { email } : {},
                            ].filter(obj => Object.keys(obj).length > 0),
                        },
                    ],
                },
            })

            if (existingUser) {
                return NextResponse.json(
                    { error: 'Username or email already taken' },
                    { status: 409 }
                )
            }
        }

        // Handle avatar upload
        let avatarUrl: string | undefined = undefined
        if (avatar && avatar.startsWith('data:')) {
            try {
                // Get current user to check for old avatar
                const currentUser = await prisma.user.findUnique({
                    where: { id: payload.userId },
                })

                // Upload new avatar
                avatarUrl = await uploadAvatarFromDataUrl(payload.userId, avatar)

                // Delete old avatar if exists
                if (currentUser?.avatar) {
                    await deleteAvatar(currentUser.avatar)
                }
            } catch (uploadError) {
                safeError('Avatar upload error:', uploadError)
                // Continue without updating avatar
            }
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: payload.userId },
            data: {
                ...(username && { username }),
                ...(email && { email }),
                ...(avatarUrl && { avatar: avatarUrl }),
                ...(country !== undefined && { country }),
                ...(age !== undefined && { age: typeof age === 'string' ? parseInt(age) : age }),
                ...(gender !== undefined && { gender }),
                ...(team !== undefined && { team }),
                ...(youtubeLink !== undefined && { youtubeLink }),
                ...(discordId !== undefined && { discordId }),
                ...(twitter !== undefined && { twitter }),
                ...(bluesky !== undefined && { bluesky }),
            },
        })

        // Don't return password
        const { password: _, ...userWithoutPassword } = updatedUser

        // Generate signed URL for avatar if exists (private bucket)
        let avatarSignedUrl = null
        if (updatedUser.avatar) {
            avatarSignedUrl = await getAvatarSignedUrl(updatedUser.avatar)
        }

        return NextResponse.json({
            success: true,
            user: {
                ...userWithoutPassword,
                avatarUrl: avatarSignedUrl, // Temporary signed URL for display
            },
        })
    } catch (error) {
        safeError('Update profile error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE - Delete user account
export async function DELETE(request: NextRequest) {
    try {
        // Get token
        const token = request.cookies.get('auth-token')?.value ||
            request.headers.get('Authorization')?.replace('Bearer ', '')

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Verify token
        const payload = await verifyToken(token)
        if (!payload) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            )
        }

        // Get user to delete avatar
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Delete avatar from storage if exists
        if (user.avatar) {
            try {
                await deleteAvatar(user.avatar)
            } catch (e) {
                safeError('Error deleting avatar:', e)
            }
        }

        // Delete password reset tokens
        await prisma.passwordResetToken.deleteMany({
            where: { userId: payload.userId },
        })

        // Delete user
        await prisma.user.delete({
            where: { id: payload.userId },
        })

        // Clear auth cookie
        const response = NextResponse.json({
            success: true,
            message: 'Account deleted successfully',
        })
        response.cookies.delete('auth-token')

        return response
    } catch (error) {
        safeError('Delete account error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT - Change password
export async function PUT(request: NextRequest) {
    try {
        // Get token
        const token = request.cookies.get('auth-token')?.value ||
            request.headers.get('Authorization')?.replace('Bearer ', '')

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Verify token
        const payload = await verifyToken(token)
        if (!payload) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { currentPassword, newPassword } = body

        // Validation
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Current password and new password are required' },
                { status: 400 }
            )
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'New password must be at least 6 characters' },
                { status: 400 }
            )
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password)
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12)

        // Update password
        await prisma.user.update({
            where: { id: payload.userId },
            data: { password: hashedPassword },
        })

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully',
        })
    } catch (error) {
        safeError('Change password error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
