import type { TeamGroup, TeamMember } from '@/types/team';

const mockMembers: TeamMember[] = [
  {
    id: 'test-aurora',
    name: 'Aurora Lane',
    handle: '@auroralane',
    role: 'Sequence Director',
    group: 'Leadership',
    bio: 'Coordinates story beats and keeps the portal schedule aligned with cross-region drops.',
    avatar: {
      src: '/assets/roster/jiwoo-song.svg',
      alt: 'Futuristic portrait of Aurora Lane.',
    },
    socials: [
      {
        platform: 'twitter',
        url: 'https://twitter.com/auroralane',
      },
      {
        platform: 'youtube',
        url: 'https://youtube.com/@auroralane',
      },
    ],
  },
  {
    id: 'test-shade',
    name: 'Shade Mercer',
    handle: '@shadefx',
    role: 'FX Artist',
    group: 'Sound & FX',
    bio: 'Designs ambient particles and shimmering gate trails for the Solo Leveling roster.',
    avatar: {
      src: '/assets/roster/oscar-velez.svg',
      alt: 'Portrait of Shade Mercer with neon vapor.',
    },
    socials: [
      {
        platform: 'discord',
        url: 'https://discord.gg/example',
        label: 'Join Shade on Discord',
      },
    ],
  },
  {
    id: 'test-kitsu',
    name: 'Kitsu Myles',
    handle: '@kitsumyles',
    role: 'Sound Designer',
    group: 'Sound & FX',
    bio: 'Layers pulsewidth bass and crystalline risers that follow the hunter cadence.',
    avatar: {
      src: '/assets/roster/nova-chen.svg',
      alt: 'Portrait of Kitsu Myles lit by cyan light.',
    },
    socials: [],
  },
];

export const mockTeamGroups: TeamGroup[] = [
  {
    id: 'leadership',
    title: 'Leadership Vanguard',
    summary: 'Directors mapping the drop cadence and ensuring each hunter stays in sync.',
    members: mockMembers.slice(0, 1),
  },
  {
    id: 'sound-fx',
    title: 'Sound & FX Lab',
    summary: 'Designers weaving sonic layers and dimensional light bursts.',
    members: mockMembers.slice(1),
  },
];

export const mockTeamRoster: TeamMember[] = mockMembers;

