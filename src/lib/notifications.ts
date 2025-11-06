import { env } from './env';
import { captureException } from './sentry';

type DiscordPayload = {
  content: string;
  embeds?: Array<Record<string, unknown>>;
};

type ResendPayload = {
  to: string | string[];
  subject: string;
  html: string;
};

export type NotificationResult =
  | { delivered: true; transport: 'discord' | 'resend' }
  | { delivered: false; transport: 'discord' | 'resend'; reason: string };

export const sendDiscordNotification = async (
  payload: DiscordPayload
): Promise<NotificationResult> => {
  if (!env.DISCORD_WEBHOOK_URL) {
    return {
      delivered: false,
      transport: 'discord',
      reason: 'missing_webhook_url',
    };
  }

  captureException(new Error('Discord notification stub invoked'), {
    context: 'notifications',
    extra: { transport: 'discord', payload },
  });

  console.info('[notifications] Discord webhook stub invoked.', payload);

  return {
    delivered: false,
    transport: 'discord',
    reason: 'stubbed',
  };
};

export const sendResendMail = async (payload: ResendPayload): Promise<NotificationResult> => {
  if (!env.RESEND_API_KEY) {
    return {
      delivered: false,
      transport: 'resend',
      reason: 'missing_api_key',
    };
  }

  captureException(new Error('Resend mail stub invoked'), {
    context: 'notifications',
    extra: { transport: 'resend', payload },
  });

  console.info('[notifications] Resend mail stub invoked.', {
    to: payload.to,
    subject: payload.subject,
  });

  return {
    delivered: false,
    transport: 'resend',
    reason: 'stubbed',
  };
};
