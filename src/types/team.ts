import { z } from 'zod';

export const teamSocialPlatformSchema = z.enum(['twitter', 'youtube', 'discord', 'twitch', 'website']);

export const teamSocialLinkSchema = z.object({
  platform: teamSocialPlatformSchema,
  url: z.string().url(),
  label: z.string().min(1).optional(),
});

export const teamMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  handle: z.string().min(1),
  role: z.string().min(1),
  group: z.string().min(1),
  bio: z.string().min(1),
  avatar: z.object({
    src: z.string().min(1),
    alt: z.string().min(1),
  }),
  socials: z.array(teamSocialLinkSchema).default([]),
});

export const teamGroupSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  members: z.array(teamMemberSchema),
});

export type TeamSocialPlatform = z.infer<typeof teamSocialPlatformSchema>;
export type TeamSocialLink = z.infer<typeof teamSocialLinkSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamGroup = z.infer<typeof teamGroupSchema>;

