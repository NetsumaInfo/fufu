import { NextResponse } from 'next/server'

// POST - Logout (clear cookie)
export async function POST() {
    const response = NextResponse.json({
        success: true,
        message: 'Logged out successfully',
    })

    response.cookies.delete('auth-token')

    return response
}
