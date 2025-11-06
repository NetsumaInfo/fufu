import { z } from 'zod';

const trimmedString = z.string().trim();

const httpUrlSchema = z
  .string()
  .trim()
  .url('Provide a valid URL.')
  .refine(
    (value) => value.startsWith('http://') || value.startsWith('https://'),
    'URL must begin with http:// or https://.'
  );

const youtubeUrlSchema = httpUrlSchema.refine(
  (value) => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(value),
  'Provide a valid YouTube URL.'
);

const discordHandleSchema = trimmedString
  .min(2, 'Discord handle is required.')
  .regex(/^.{2,32}#[0-9]{4}$/i, 'Use username#1234 format for Discord handles.');

const ageSchema = z
  .string()
  .trim()
  .min(1, 'Age is required.')
  .regex(/^[0-9]{1,3}$/, 'Age must be a valid number.')
  .refine((value) => {
    const numeric = Number.parseInt(value, 10);
    return numeric >= 13 && numeric <= 120;
  }, 'Age must be between 13 and 120.');

export const recruitmentFieldNames = [
  'name',
  'alias',
  'age',
  'location',
  'discordHandle',
  'youtubeChannelUrl',
  'bestAmvUrl',
  'recentAmvUrl',
  'introduction',
  'availability',
] as const;

export type RecruitmentFieldName = (typeof recruitmentFieldNames)[number];

export const recruitmentFormSchema = z.object({
  name: trimmedString.min(1, 'Name is required.'),
  alias: trimmedString.min(1, 'Alias is required.'),
  age: ageSchema,
  location: trimmedString.min(1, 'Location is required.'),
  discordHandle: discordHandleSchema,
  youtubeChannelUrl: youtubeUrlSchema,
  bestAmvUrl: youtubeUrlSchema,
  recentAmvUrl: youtubeUrlSchema,
  introduction: trimmedString.min(30, 'Share at least 30 characters about yourself.'),
  availability: trimmedString.optional().transform((value) => value ?? ''),
  honeypot: trimmedString.optional().transform((value) => value ?? ''),
});

export type RecruitmentFormValues = z.infer<typeof recruitmentFormSchema>;

export const recruitmentInitialValues: RecruitmentFormValues = {
  name: '',
  alias: '',
  age: '',
  location: '',
  discordHandle: '',
  youtubeChannelUrl: '',
  bestAmvUrl: '',
  recentAmvUrl: '',
  introduction: '',
  availability: '',
  honeypot: '',
};
