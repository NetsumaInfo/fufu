'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

import { Chip } from '@/components/ui/Chip';
import { SocialLink } from '@/components/ui/SocialLink';
import type { TeamMember } from '@/types/team';

type MemberCardProps = {
  member: TeamMember;
};

export function MemberCard({ member }: MemberCardProps) {
  const { name, role, handle, bio, avatar, socials, group } = member;
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const initials = useMemo(() => getInitials(name), [name]);
  const imageClasses = hasAvatarError ? 'team-card__image opacity-0' : 'team-card__image';

  return (
    <article className="team-card group">
      <div className="team-card__halo" aria-hidden />
      <div className="flex flex-col gap-5">
        <div className="relative">
          <div className="team-card__avatar">
            <Image
              src={avatar.src}
              alt={avatar.alt}
              width={480}
              height={420}
              className={imageClasses}
              priority={false}
              onError={() => setHasAvatarError(true)}
            />
            {hasAvatarError ? (
              <div className="team-card__avatar-fallback" aria-hidden>
                <span>{initials}</span>
              </div>
            ) : null}
            <div className="team-card__avatar-glow" aria-hidden />
          </div>
          <div className="pointer-events-none absolute inset-x-6 -bottom-7 flex flex-wrap items-center gap-3">
            <Chip variant="glow">{role}</Chip>
            <span className="handle-chip">{handle}</span>
          </div>
        </div>

        <div className="pt-8">
          <p className="text-xs uppercase tracking-[0.45em] text-solo-300">{group}</p>
          <h3 className="mt-2 font-accent text-2xl uppercase tracking-[0.3em] text-white">{name}</h3>
          <p className="mt-3 text-sm text-solo-200">{bio}</p>
        </div>
      </div>

      {socials.length > 0 ? (
        <div className="mt-auto flex items-center gap-3">
          {socials.map((social) => (
            <SocialLink
              key={`${member.id}-${social.platform}`}
              platform={social.platform}
              href={social.url}
              label={social.label ?? `${name} on ${social.platform}`}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}

function getInitials(name: string) {
  const letters = name
    .split(/\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => segment[0]!.toUpperCase());

  const result = letters.slice(0, 2).join('');

  return result || '??';
}
