import { NextRequest, NextResponse } from 'next/server';
import { safeError } from '@/lib/utils/errorLogger'

type FormType = 'apply' | 'contact';

interface ApplyFormData {
    type: 'apply';
    username: string;
    discordId: string;
    age: string;
    nationality: string;
    bestAmv: string;
    message?: string;
}

interface ContactFormData {
    type: 'contact';
    name: string;
    discordId?: string;
    email: string;
    subject: string;
    message: string;
}

type FormData = ApplyFormData | ContactFormData;

export async function POST(request: NextRequest) {
    try {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookUrl) {
            safeError('DISCORD_WEBHOOK_URL is not configured');
            return NextResponse.json(
                { error: 'Service temporarily unavailable' },
                { status: 503 }
            );
        }

        const data: FormData = await request.json();
        const timestamp = new Date().toLocaleString('fr-FR', {
            timeZone: 'Europe/Paris',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let embed;

        if (data.type === 'apply') {
            // Candidature embed
            embed = {
                title: '📋 Nouvelle Candidature',
                color: 0x7c3aed, // Violet/primary color
                fields: [
                    {
                        name: '👤 Pseudo',
                        value: data.username || 'Non renseigné',
                        inline: true
                    },
                    {
                        name: '💬 Discord',
                        value: data.discordId || 'Non renseigné',
                        inline: true
                    },
                    {
                        name: '🎂 Âge',
                        value: data.age || 'Non renseigné',
                        inline: true
                    },
                    {
                        name: '🌍 Nationalité',
                        value: data.nationality || 'Non renseigné',
                        inline: true
                    },
                    {
                        name: '🎬 Meilleur AMV',
                        value: data.bestAmv || 'Non renseigné',
                        inline: false
                    },
                    ...(data.message ? [{
                        name: '📝 Message',
                        value: data.message.substring(0, 1024), // Discord limit
                        inline: false
                    }] : [])
                ],
                footer: {
                    text: `📅 ${timestamp}`
                },
                timestamp: new Date().toISOString()
            };
        } else {
            // Contact embed
            embed = {
                title: '✉️ Nouveau Message',
                color: 0x10b981, // Green color
                fields: [
                    {
                        name: '👤 Nom',
                        value: data.name || 'Non renseigné',
                        inline: true
                    },
                    {
                        name: '📧 Email',
                        value: data.email || 'Non renseigné',
                        inline: true
                    },
                    ...(data.discordId ? [{
                        name: '💬 Discord',
                        value: data.discordId,
                        inline: true
                    }] : []),
                    {
                        name: '📌 Sujet',
                        value: data.subject || 'Non renseigné',
                        inline: false
                    },
                    {
                        name: '💬 Message',
                        value: data.message?.substring(0, 1024) || 'Aucun message', // Discord limit
                        inline: false
                    }
                ],
                footer: {
                    text: `📅 ${timestamp}`
                },
                timestamp: new Date().toISOString()
            };
        }

        // Send to Discord
        const discordResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [embed]
            }),
        });

        if (!discordResponse.ok) {
            const errorText = await discordResponse.text();
            safeError('Discord webhook error:', errorText);
            return NextResponse.json(
                { error: 'Failed to send message' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        safeError('Contact API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
