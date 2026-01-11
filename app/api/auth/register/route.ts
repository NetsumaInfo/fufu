import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/lib/auth/jwt'
import { uploadAvatarFromDataUrl, getAvatarSignedUrl } from '@/lib/supabase/storage'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {
            username,
            email,
            password,
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

        // Validation
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: 'Username, email, and password are required' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email },
                ],
            },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Username or email already exists' },
                { status: 409 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Upload avatar to Supabase Storage if provided
        // avatarPath stores the file path, not the URL (private bucket)
        let avatarPath: string | null = null
        if (avatar && avatar.startsWith('data:')) {
            try {
                // Create user first to get ID
                const tempUser = await prisma.user.create({
                    data: {
                        username,
                        email,
                        password: hashedPassword,
                        country: country || null,
                        age: age ? parseInt(age) : null,
                        gender: gender || null,
                        team: team || null,
                        youtubeLink: youtubeLink || null,
                        discordId: discordId || null,
                        twitter: twitter || null,
                        bluesky: bluesky || null,
                    },
                })

                // Upload avatar (returns file path, not URL)
                avatarPath = await uploadAvatarFromDataUrl(tempUser.id, avatar)

                // Update user with avatar path
                await prisma.user.update({
                    where: { id: tempUser.id },
                    data: { avatar: avatarPath },
                })

                // Generate signed URL for response
                const avatarSignedUrl = await getAvatarSignedUrl(avatarPath)

                // Return user data with signed URL
                const { password: _, ...userWithoutPassword } = { ...tempUser, avatar: avatarPath }

                // Generate JWT token
                const token = generateToken({
                    userId: tempUser.id,
                    username: tempUser.username,
                    email: tempUser.email,
                })

                return NextResponse.json({
                    success: true,
                    user: {
                        ...userWithoutPassword,
                        avatarUrl: avatarSignedUrl, // Temporary signed URL for display
                    },
                    token,
                })
            } catch (uploadError) {
                console.error('Avatar upload error:', uploadError)
                // Continue without avatar
            }
        }

        // Create user without avatar
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                avatar: avatarPath,
                country: country || null,
                age: age ? parseInt(age) : null,
                gender: gender || null,
                team: team || null,
                youtubeLink: youtubeLink || null,
                discordId: discordId || null,
                twitter: twitter || null,
                bluesky: bluesky || null,
            },
        })

        // Don't return password
        const { password: _, ...userWithoutPassword } = user

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            username: user.username,
            email: user.email,
        })

        return NextResponse.json({
            success: true,
            user: userWithoutPassword,
            token,
        })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
