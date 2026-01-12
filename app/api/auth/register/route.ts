import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/lib/auth/jwt'
import { uploadAvatarFromDataUrl, getAvatarSignedUrl } from '@/lib/supabase/storage'
import { getResendClient, getResendFromEmail } from '@/lib/resend'

// Helper function to send welcome email
async function sendWelcomeEmail(email: string, username: string) {
    try {
        const resend = getResendClient()
        await resend.emails.send({
            from: getResendFromEmail(),
            to: [email],
            subject: 'Bienvenue sur Fulguria ! 🎉',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px; border-radius: 16px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #7c3aed; margin: 0; font-size: 28px;">Bienvenue sur Fulguria !</h1>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 12px; border: 1px solid rgba(124,58,237,0.3);">
                        <p style="color: #e0e0e0; font-size: 16px; margin-bottom: 20px;">
                            Salut <strong style="color: #7c3aed;">${username}</strong> ! 👋
                        </p>
                        <p style="color: #b0b0b0; font-size: 14px; line-height: 1.6;">
                            Ton compte a été créé avec succès. Tu fais maintenant partie de la communauté Fulguria !
                        </p>
                        <p style="color: #b0b0b0; font-size: 14px; line-height: 1.6;">
                            N'hésite pas à compléter ton profil et à explorer notre contenu.
                        </p>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/profile" 
                               style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                                Voir mon profil
                            </a>
                        </div>
                    </div>
                    <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
                        © Fulguria Team - Tous droits réservés
                    </p>
                </div>
            `,
        })
    } catch (error) {
        console.error('Welcome email error:', error)
        // Don't throw - email failure shouldn't block registration
    }
}

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

                // Send welcome email (async, don't wait)
                sendWelcomeEmail(tempUser.email, tempUser.username)

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

        // Send welcome email (async, don't wait)
        sendWelcomeEmail(user.email, user.username)

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
