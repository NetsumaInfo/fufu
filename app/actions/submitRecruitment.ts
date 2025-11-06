'use server';

import { headers } from 'next/headers';

import {
  createHoneypotField,
  createInitialFormState,
  formDataToObject,
  type FormErrors,
  type FormState,
} from '@/lib/forms';
import { appendRecruitmentSubmission } from '@/lib/kv';
import { sendDiscordNotification } from '@/lib/notifications';
import { rateLimitByIp } from '@/lib/rateLimit';
import { captureException } from '@/lib/sentry';
import { formatHashPreview, hashSensitiveValue } from '@/lib/security';
import {
  recruitmentFieldNames,
  recruitmentFormSchema,
  type RecruitmentFieldName,
} from '@/lib/validators';
import type { NormalizedRecruitmentSubmission } from '@/types/recruitment';

const SUCCESS_MESSAGE = 'Submission received. Expect a reply within 48 hours.';
const ERROR_MESSAGE = 'We could not process your submission. Please try again shortly.';

const RATE_LIMIT_CONFIG = {
  prefix: 'recruitment',
  maxRequests: 3,
  windowSeconds: 60 * 60,
} as const;

export type RecruitmentFormState = FormState<RecruitmentFieldName>;

const truncate = (value: string, max = 1024) =>
  value.length > max ? `${value.slice(0, Math.max(0, max - 3))}...` : value;

const resolveClientIp = async (): Promise<string | null> => {
  let headerList: Awaited<ReturnType<typeof headers>> | null = null;

  try {
    headerList = await headers();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (!message.includes('outside a request scope')) {
      captureException(error, {
        context: 'submitRecruitmentAction.resolveClientIp',
      });
    }

    return null;
  }

  if (!headerList) {
    return null;
  }

  const forwardedFor = headerList.get('x-forwarded-for');

  if (forwardedFor) {
    const [first] = forwardedFor.split(',');
    if (first && first.trim().length > 0) {
      return first.trim();
    }
  }

  const realIp = headerList.get('x-real-ip');
  if (realIp && realIp.trim().length > 0) {
    return realIp.trim();
  }

  return null;
};

const createSuccessState = (): RecruitmentFormState => ({
  status: 'success',
  message: SUCCESS_MESSAGE,
  errors: {},
});

export async function submitRecruitmentAction(
  _prevState: RecruitmentFormState,
  formData: FormData
): Promise<RecruitmentFormState> {
  const baseState = createInitialFormState<RecruitmentFieldName>();
  const honeypotField = createHoneypotField('recruitment');
  const honeypotValue = formData.get(honeypotField.name);
  const honeypot = typeof honeypotValue === 'string' ? honeypotValue.trim() : '';

  if (honeypot.length > 0) {
    captureException(new Error('Recruitment honeypot triggered.'), {
      context: 'submitRecruitmentAction',
    });
    return createSuccessState();
  }

  try {
    const rawValues = formDataToObject(formData, recruitmentFieldNames);
    const validation = recruitmentFormSchema.safeParse({
      ...rawValues,
      honeypot,
    });

    if (!validation.success) {
      const fieldErrors: FormErrors<RecruitmentFieldName> = {};
      const flattened = validation.error.flatten().fieldErrors;

      (Object.keys(flattened) as Array<keyof typeof flattened>).forEach((key) => {
        if (key === 'honeypot') {
          return;
        }

        const message = flattened[key]?.[0];
        if (message) {
          fieldErrors[key as RecruitmentFieldName] = message;
        }
      });

      return {
        status: 'error',
        message: 'Please review the highlighted fields.',
        errors: fieldErrors,
      };
    }

    const { honeypot: _discarded, ...submission } = validation.data;
    const clientIp = await resolveClientIp();
    const ipHash = hashSensitiveValue(clientIp);

    if (ipHash) {
      const limit = await rateLimitByIp(ipHash, RATE_LIMIT_CONFIG);
      if (!limit.success) {
        captureException(new Error('Recruitment submission rate limited.'), {
          context: 'submitRecruitmentAction',
          extra: {
            ipHash,
            reset: limit.reset,
          },
        });
        return createSuccessState();
      }
    }

    const submissionId = crypto.randomUUID();
    const receivedAt = new Date().toISOString();
    const normalized: NormalizedRecruitmentSubmission = submission;

    await appendRecruitmentSubmission({
      id: submissionId,
      receivedAt,
      source: 'web',
      submission: normalized,
      ipHash,
    });

    const availability = normalized.availability.trim().length
      ? normalized.availability
      : 'Not provided';

    const discordResult = await sendDiscordNotification({
      content: 'A new recruitment submission just landed.',
      embeds: [
        {
          title: `${normalized.alias} applied to join Fulguria`,
          description: truncate(normalized.introduction, 1500),
          color: 0x4f46e5,
          url: normalized.youtubeChannelUrl,
          fields: [
            { name: 'Name', value: normalized.name, inline: true },
            { name: 'Alias', value: normalized.alias, inline: true },
            { name: 'Discord', value: normalized.discordHandle, inline: true },
            { name: 'Age', value: normalized.age, inline: true },
            { name: 'Location', value: normalized.location, inline: true },
            { name: 'Availability', value: availability, inline: false },
            { name: 'YouTube Channel', value: normalized.youtubeChannelUrl, inline: false },
            { name: 'Best AMV', value: normalized.bestAmvUrl, inline: false },
            { name: 'Recent AMV', value: normalized.recentAmvUrl, inline: false },
          ],
          footer: {
            text: `Submission ${submissionId}${
              formatHashPreview(ipHash) ? ` | IP ${formatHashPreview(ipHash)}` : ''
            }`,
          },
          timestamp: receivedAt,
        },
      ],
    });

    if (!discordResult.delivered) {
      captureException(new Error('Discord notification delivery failed.'), {
        context: 'submitRecruitmentAction',
        extra: {
          submissionId,
          reason: discordResult.reason,
        },
      });
    }

    return createSuccessState();
  } catch (error) {
    captureException(error, {
      context: 'submitRecruitmentAction',
    });

    return {
      ...baseState,
      status: 'error',
      message: ERROR_MESSAGE,
    };
  }
}
