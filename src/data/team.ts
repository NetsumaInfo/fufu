import { teamGroupSchema, type TeamGroup, type TeamMember } from '@/types/team';

const rosterSeed = [
  {
    id: 'leadership',
    title: 'Leadership & Direction',
    summary:
      'Strategists mapping Solo Leveling into a cohesive release plan while keeping portal energy stable.',
    members: [
      {
        id: 'jiwoo-song',
        name: 'Jiwoo Song',
        handle: '@shadowdial',
        role: 'Creative Director',
        group: 'Leadership',
        bio: 'Orchestrates narrative pacing and motion briefs so every drop stays canon with the awakening arc.',
        avatar: {
          src: '/assets/roster/jiwoo-song.svg',
          alt: 'Portrait of Jiwoo Song looking toward a glowing gateway.',
        },
        socials: [
          {
            platform: 'twitter',
            url: 'https://twitter.com/shadowdial',
          },
          {
            platform: 'youtube',
            url: 'https://youtube.com/@shadowdial',
          },
        ],
      },
      {
        id: 'mina-park',
        name: 'Mina Park',
        handle: '@awakenatlas',
        role: 'Executive Producer',
        group: 'Leadership',
        bio: 'Keeps timelines aligned across studios and syncs daily rituals with guild partners in Seoul and Paris.',
        avatar: {
          src: '/assets/roster/mina-park.svg',
          alt: 'Portrait of Mina Park framed by crystalline shards.',
        },
        socials: [
          {
            platform: 'twitter',
            url: 'https://twitter.com/awakenatlas',
          },
          {
            platform: 'discord',
            url: 'https://discord.gg/fulguria',
            label: 'Join Mina on Discord',
          },
        ],
      },
    ],
  },
  {
    id: 'animation',
    title: 'Animation Core',
    summary:
      'Hybrid animators stitching fight choreography, particle passes, and AMV loops for every hunter portal.',
    members: [
      {
        id: 'kai-nguyen',
        name: 'Kai Nguyen',
        handle: '@framesurge',
        role: 'Lead Animator',
        group: 'Animation',
        bio: 'Specializes in kinetic sequences and translates raw mocap into visceral dimensional rifts.',
        avatar: {
          src: '/assets/roster/kai-nguyen.svg',
          alt: 'Portrait of Kai Nguyen against a neon city grid.',
        },
        socials: [
          {
            platform: 'youtube',
            url: 'https://youtube.com/@framesurge',
          },
          {
            platform: 'twitter',
            url: 'https://twitter.com/framesurge',
          },
        ],
      },
      {
        id: 'lila-burns',
        name: 'Lila Burns',
        handle: '@lazelight',
        role: 'Cel Shader',
        group: 'Animation',
        bio: 'Paints energy flares and aura gradients, ensuring every panel glows with arcane resonance.',
        avatar: {
          src: '/assets/roster/lila-burns.svg',
          alt: 'Portrait of Lila Burns lit by a purple light field.',
        },
        socials: [
          {
            platform: 'twitch',
            url: 'https://twitch.tv/lazelight',
          },
          {
            platform: 'twitter',
            url: 'https://twitter.com/lazelight',
          },
        ],
      },
    ],
  },
  {
    id: 'fx-sound',
    title: 'Sound & FX Lab',
    summary:
      'Engineers layering dimensional audio, remixed beats, and portal VFX to keep the roster battle-ready.',
    members: [
      {
        id: 'oscar-velez',
        name: 'Oscar Velez',
        handle: '@riftfoundry',
        role: 'FX Composer',
        group: 'Sound & FX',
        bio: 'Builds volumetric bursts and spectral trails that react to hunter stats in real time.',
        avatar: {
          src: '/assets/roster/oscar-velez.svg',
          alt: 'Portrait of Oscar Velez with cyan energy arcs.',
        },
        socials: [
          {
            platform: 'youtube',
            url: 'https://youtube.com/@riftfoundry',
          },
        ],
      },
      {
        id: 'nova-chen',
        name: 'Nova Chen',
        handle: '@sonicloom',
        role: 'Sound Designer',
        group: 'Sound & FX',
        bio: 'Threads pulsewidth bass and crystalline chimes so every gate sounds like a new dimension opening.',
        avatar: {
          src: '/assets/roster/nova-chen.svg',
          alt: 'Portrait of Nova Chen surrounded by waveform rings.',
        },
        socials: [
          {
            platform: 'twitter',
            url: 'https://twitter.com/sonicloom',
          },
          {
            platform: 'website',
            url: 'https://sonicloom.studio',
            label: "Visit Nova's site",
          },
        ],
      },
    ],
  },
] as const satisfies TeamGroup[];

export const teamGroups: TeamGroup[] = teamGroupSchema.array().parse(rosterSeed);
export const teamRoster: TeamMember[] = teamGroups.flatMap((group) => group.members);
