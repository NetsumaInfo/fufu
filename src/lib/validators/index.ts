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

export * from './recruitment';
