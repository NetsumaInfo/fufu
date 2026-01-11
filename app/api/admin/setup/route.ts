import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Secret key to protect this endpoint (changez cette valeur!)
const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET || 'change-me-in-production'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { secret, username, email, password, country, age, gender, team, discordId } = body

        // Verify secret key
        if (secret !== SETUP_SECRET) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        if (!username || !email || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Admin credentials from request
        const adminData = {
            username,
            email,
            password,
            role: 'admin' as const,
            country,
            age: age ? parseInt(age) : null,
            gender,
            team,
            discordId,
        }
        // Check if admin already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: adminData.email },
                    { username: adminData.username },
                ],
            },
        })

        if (existingUser) {
            // Update to admin if not already
            if (existingUser.role !== 'admin') {
                await prisma.user.update({
                    where: { id: existingUser.id },
                    data: { role: 'admin' },
                })

                return NextResponse.json({
                    success: true,
                    message: 'User promoted to admin',
                    user: {
                        id: existingUser.id,
                        username: existingUser.username,
                        email: existingUser.email,
                        role: 'admin',
                    },
                })
            }

            return NextResponse.json({
                success: true,
                message: 'Admin user already exists',
                user: {
                    id: existingUser.id,
                    username: existingUser.username,
                    email: existingUser.email,
                    role: existingUser.role,
                },
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminData.password, 12)

        // Create admin user
        const admin = await prisma.user.create({
            data: {
                username: adminData.username,
                email: adminData.email,
                password: hashedPassword,
                role: adminData.role,
                country: adminData.country,
                age: adminData.age,
                gender: adminData.gender,
                team: adminData.team,
                discordId: adminData.discordId,
            },
        })

        // Don't return password
        const { password: _, ...adminWithoutPassword } = admin

        return NextResponse.json({
            success: true,
            message: 'Admin user created successfully',
            user: adminWithoutPassword,
        })
    } catch (error) {
        console.error('Create admin error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
