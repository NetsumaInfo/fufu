'use client';

import {
  ChangeEvent,
  FormEvent,
  useActionState,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';

import { submitRecruitmentAction } from '@app/actions/submitRecruitment';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { FormField } from '@/components/recruitment/FormField';
import { SubmissionStatus } from '@/components/recruitment/SubmissionStatus';
import {
  createHoneypotField,
  createInitialFormState,
  type FormErrors,
} from '@/lib/forms';
import {
  recruitmentFormSchema,
  recruitmentInitialValues,
  type RecruitmentFieldName,
  type RecruitmentFormValues,
} from '@/lib/validators';

const initialFormState = createInitialFormState<RecruitmentFieldName>();
const honeypotField = createHoneypotField('recruitment');

type InputEvent =
  | ChangeEvent<HTMLInputElement>
  | ChangeEvent<HTMLTextAreaElement>;

export function RecruitForm() {
  const [values, setValues] = useState<RecruitmentFormValues>({
    ...recruitmentInitialValues,
  });
  const [clientErrors, setClientErrors] = useState<FormErrors<RecruitmentFieldName>>({});
  const [formState, formAction, isPending] = useActionState(
    submitRecruitmentAction,
    initialFormState
  );
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (formState.status === 'success') {
      setValues({ ...recruitmentInitialValues });
      setClientErrors({});
    }
  }, [formState.status]);

  const fieldErrors = useMemo(() => {
    return {
      ...clientErrors,
      ...formState.errors,
    };
  }, [clientErrors, formState.errors]);

  const handleValueChange = (field: keyof RecruitmentFormValues) => (event: InputEvent) => {
    const nextValue = event.target.value;

    setValues((prev) => ({
      ...prev,
      [field]: nextValue,
    }));

    if (field !== 'honeypot') {
      setClientErrors((prev) => {
        const key = field as RecruitmentFieldName;
        if (!prev[key]) {
          return prev;
        }

        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const submission = {
      ...values,
      honeypot: formData.get(honeypotField.name)?.toString() ?? '',
    };

    const result = recruitmentFormSchema.safeParse(submission);

    if (!result.success) {
      const nextErrors: FormErrors<RecruitmentFieldName> = {};
      const flattened = result.error.flatten().fieldErrors;

      (Object.keys(flattened) as Array<keyof typeof flattened>).forEach((key) => {
        if (key === 'honeypot') {
          return;
        }

        const message = flattened[key]?.[0];
        if (message) {
          nextErrors[key as RecruitmentFieldName] = message;
        }
      });

      setClientErrors(nextErrors);
      return;
    }

    setClientErrors({});
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form
      className="recruit-form grid gap-8"
      data-testid="recruit-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          id="recruit-name"
          label="Full Name"
          required
          error={fieldErrors.name}
        >
          <Input
            name="name"
            value={values.name}
            onChange={handleValueChange('name')}
            placeholder="Jane Doe"
            autoComplete="name"
            disabled={isPending}
            invalid={Boolean(fieldErrors.name)}
          />
        </FormField>

        <FormField
          id="recruit-alias"
          label="Alias"
          required
          error={fieldErrors.alias}
        >
          <Input
            name="alias"
            value={values.alias}
            onChange={handleValueChange('alias')}
            placeholder="AuroraBlade"
            autoComplete="nickname"
            disabled={isPending}
            invalid={Boolean(fieldErrors.alias)}
          />
        </FormField>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          id="recruit-age"
          label="Age"
          required
          error={fieldErrors.age}
        >
          <Input
            name="age"
            value={values.age}
            onChange={handleValueChange('age')}
            placeholder="18"
            inputMode="numeric"
            autoComplete="off"
            disabled={isPending}
            invalid={Boolean(fieldErrors.age)}
          />
        </FormField>

        <FormField
          id="recruit-location"
          label="Location"
          required
          error={fieldErrors.location}
        >
          <Input
            name="location"
            value={values.location}
            onChange={handleValueChange('location')}
            placeholder="Paris, France"
            autoComplete="country-name"
            disabled={isPending}
            invalid={Boolean(fieldErrors.location)}
          />
        </FormField>
      </div>

      <FormField
        id="recruit-discord"
        label="Discord Handle"
        required
        helperText="Use the format username#1234 so we can find you instantly."
        error={fieldErrors.discordHandle}
      >
        <Input
          name="discordHandle"
          value={values.discordHandle}
          onChange={handleValueChange('discordHandle')}
          placeholder="fulguria#0001"
          autoComplete="off"
          disabled={isPending}
          invalid={Boolean(fieldErrors.discordHandle)}
        />
      </FormField>

      <FormField
        id="recruit-channel"
        label="YouTube Channel"
        required
        helperText="Link to the channel hosting your AMVs (YouTube only)."
        error={fieldErrors.youtubeChannelUrl}
      >
        <Input
          name="youtubeChannelUrl"
          value={values.youtubeChannelUrl}
          onChange={handleValueChange('youtubeChannelUrl')}
          placeholder="https://www.youtube.com/@fulguria"
          inputMode="url"
          autoComplete="url"
          disabled={isPending}
          invalid={Boolean(fieldErrors.youtubeChannelUrl)}
        />
      </FormField>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          id="recruit-best-amv"
          label="Best AMV"
          required
          error={fieldErrors.bestAmvUrl}
        >
          <Input
            name="bestAmvUrl"
            value={values.bestAmvUrl}
            onChange={handleValueChange('bestAmvUrl')}
            placeholder="https://youtu.be/your-best-amv"
            inputMode="url"
            autoComplete="off"
            disabled={isPending}
            invalid={Boolean(fieldErrors.bestAmvUrl)}
          />
        </FormField>

        <FormField
          id="recruit-recent-amv"
          label="Recent AMV"
          required
          error={fieldErrors.recentAmvUrl}
        >
          <Input
            name="recentAmvUrl"
            value={values.recentAmvUrl}
            onChange={handleValueChange('recentAmvUrl')}
            placeholder="https://youtu.be/your-latest-amv"
            inputMode="url"
            autoComplete="off"
            disabled={isPending}
            invalid={Boolean(fieldErrors.recentAmvUrl)}
          />
        </FormField>
      </div>

      <FormField
        id="recruit-introduction"
        label="Introduction"
        required
        helperText="Tell us how you craft AMVs, what inspires you, and what you want to explore with Fulguria."
        error={fieldErrors.introduction}
      >
        <TextArea
          name="introduction"
          value={values.introduction}
          onChange={handleValueChange('introduction')}
          placeholder="Share your editing style, experience, and why you want to join."
          rows={6}
          disabled={isPending}
          invalid={Boolean(fieldErrors.introduction)}
        />
      </FormField>

      <FormField
        id="recruit-availability"
        label="Availability (Optional)"
        helperText="Let us know when you are most active or any scheduling constraints."
        error={fieldErrors.availability}
      >
        <TextArea
          name="availability"
          value={values.availability}
          onChange={handleValueChange('availability')}
          placeholder="Weeknights after 20:00 CET, weekends flexible..."
          rows={4}
          disabled={isPending}
          invalid={Boolean(fieldErrors.availability)}
        />
      </FormField>

      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor={honeypotField.id}>{honeypotField.label}</label>
        <input
          id={honeypotField.id}
          name={honeypotField.name}
          tabIndex={-1}
          autoComplete="off"
          value={values.honeypot}
          onChange={handleValueChange('honeypot')}
        />
      </div>

      <div className="flex flex-col gap-4">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit Application'}
        </Button>
        <SubmissionStatus status={formState.status} message={formState.message} />
      </div>
    </form>
  );
}
