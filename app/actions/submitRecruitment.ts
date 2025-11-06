'use server';

import { createHoneypotField, createInitialFormState, type FormState } from '@/lib/forms';
import type { RecruitmentFieldName } from '@/lib/validators';

export type RecruitmentFormState = FormState<RecruitmentFieldName>;

export async function submitRecruitmentAction(
  _prevState: RecruitmentFormState,
  formData: FormData
): Promise<RecruitmentFormState> {
  const baseState = createInitialFormState<RecruitmentFieldName>();
  const honeypotField = createHoneypotField('recruitment');
  const honeypotValue = formData.get(honeypotField.name);

  if (typeof honeypotValue === 'string' && honeypotValue.trim().length > 0) {
    return {
      ...baseState,
      status: 'error',
      message: 'Submission blocked. Please try again.',
    };
  }

  return {
    ...baseState,
    status: 'success',
    message: 'Submission received. Expect a reply within 48 hours.',
  };
}
