import type { z } from 'zod';

import { recruitmentFormSchema } from '@/lib/validators';

export type RecruitmentSubmission = z.infer<typeof recruitmentFormSchema>;

export type RecruitmentNotification = {
  submission: RecruitmentSubmission;
  receivedAt: string;
  source: 'web' | 'discord' | 'manual';
};
