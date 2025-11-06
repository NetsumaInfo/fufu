import { z } from 'zod';

const trimmedString = z.string().trim();

export const slugSchema = trimmedString
  .min(1)
  .regex(/^[a-z0-9\-]+$/, 'Slug may contain lowercase letters, numbers, and hyphens only.');

export const urlSchema = z.string().url('Please provide a valid URL.');

export const nullableUrlSchema = urlSchema.or(z.literal('')).transform((value) => value || '');

export const discordHandleSchema = trimmedString
  .min(2, 'Discord handle is required.')
  .regex(/^.{2,32}#[0-9]{4}$/i, 'Use the format username#1234 for Discord handles.');

export const youtubeUrlSchema = urlSchema.regex(
  /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//i,
  'Provide a valid YouTube URL.'
);

export const recruitmentPayloadSchema = z.object({
  name: trimmedString.min(1, 'Name is required.'),
  alias: trimmedString.min(1, 'Alias is required.'),
  age: z
    .string()
    .optional()
    .transform((value) => (value ? Number.parseInt(value, 10) : undefined))
    .pipe(z.number().min(13).max(120).optional()),
  location: trimmedString.optional(),
  timezone: trimmedString.optional(),
  discordHandle: discordHandleSchema,
  discordId: trimmedString.optional(),
  youtubeChannelUrl: nullableUrlSchema,
  bestAmvUrl: youtubeUrlSchema,
  recentAmvUrl: youtubeUrlSchema,
  portfolioUrl: nullableUrlSchema,
  introduction: trimmedString.min(10, 'Share at least a few words about yourself.'),
  honeypot: trimmedString.optional().transform((value) => value ?? ''),
});

export type RecruitmentPayload = z.infer<typeof recruitmentPayloadSchema>;
