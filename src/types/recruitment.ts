import type { z } from 'zod';

import { recruitmentPayloadSchema } from '@/lib/validators';

export type RecruitmentSubmission = z.infer<typeof recruitmentPayloadSchema>;

export type RecruitmentNotification = {
  submission: RecruitmentSubmission;
  receivedAt: string;
  source: 'web' | 'discord' | 'manual';
};
