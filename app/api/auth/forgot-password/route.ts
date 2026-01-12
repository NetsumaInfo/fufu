import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getResendClient, getResendFromEmail } from '@/lib/resend'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        })

        // Always return success (for security - don't reveal if email exists)
        if (!user) {
            return NextResponse.json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.',
            })
        }

        // Generate secure token
        const token = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 3600000) // 1 hour

        // Delete old tokens for this user
        await prisma.passwordResetToken.deleteMany({
            where: { userId: user.id },
        })

        // Create new reset token
        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt,
            },
        })

        // Create reset link
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`

        // Send email
        try {
            const resend = getResendClient()
            await resend.emails.send({
                from: getResendFromEmail(),
                to: [email],
                subject: 'Réinitialisation de votre mot de passe',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Réinitialisation de mot de passe</h2>
            <p>Bonjour <strong>${user.username}</strong>,</p>
            <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
            <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              Ce lien expire dans <strong>1 heure</strong>.
            </p>
            <p style="color: #666; font-size: 14px;">
              Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
            </p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              Si le bouton ne fonctionne pas, copiez ce lien : <br>
              <a href="${resetLink}" style="color: #7c3aed;">${resetLink}</a>
            </p>
          </div>
        `,
            })
        } catch (emailError) {
            console.error('Email sending error:', emailError)
            return NextResponse.json(
                { error: 'Failed to send reset email' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent.',
        })
    } catch (error) {
        console.error('Forgot password error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
