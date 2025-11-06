import { teamGroups } from '@/data/team';
import { MemberCard } from '@/components/team/MemberCard';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function TeamSection() {
  return (
    <section
      id="team"
      className="border-t border-white/5 py-28 scroll-snap-section sm:py-32 lg:py-36"
    >
      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow="Team Roster"
          title="Hunters of Fulguria"
          description="Meet the animation guild keeping Solo Leveling portals humming. Each hunter maintains their lane across direction, motion, fx, or sound so every drop stays aligned with the awakening ritual."
        />

        <div className="flex flex-col gap-16">
          {teamGroups.map((group) => (
            <div key={group.id} className="flex flex-col gap-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.45em] text-solo-300">Squad</p>
                  <h2 className="font-accent text-2xl uppercase tracking-[0.3em] text-white sm:text-3xl">
                    {group.title}
                  </h2>
                </div>
                <p className="max-w-2xl text-sm text-solo-200 sm:text-base">{group.summary}</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {group.members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
