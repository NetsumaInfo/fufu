import { RecruitForm } from '@/components/recruitment/RecruitForm';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const bulletPoints = [
  'Tell us who you are, how you edit, and what powers your AMV style.',
  'Share two flagship uploads so we can review pacing, storytelling, and polish.',
  'Expect a Discord follow-up within 48 hours once the team reviews your submission.',
];

export function RecruitSection() {
  return (
    <section
      id="recruit"
      className="relative border-t border-white/5 py-28 scroll-snap-section sm:py-32 lg:py-36"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute inset-0 bg-gradient-to-tr from-solo-dusk via-transparent to-solo-ember/10" />
        <div className="absolute inset-0 bg-solo-mesh" />
      </div>
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col gap-8">
          <SectionHeading
            align="left"
            eyebrow="Recruitment"
            title="Join The Collective"
            description="Submit your best AMVs and tell us how you want to collaborate. Our leads review every application to keep the roster sharp and collaborative."
          />
          <ul className="grid gap-4 text-sm text-solo-200">
            {bulletPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4"
              >
                <span className="mt-1 inline-flex size-2.5 shrink-0 rounded-full bg-solo-glow" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-sm text-solo-300">
            <p className="font-semibold uppercase tracking-[0.35em] text-solo-400">
              Coming Soon
            </p>
            <p className="mt-2 text-balance">
              Discord or Google sign-in will let you auto-fill roster data and notify leads instantly.
              For now, complete the form and we will reach out manually.
            </p>
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-portal backdrop-blur-md">
          <RecruitForm />
        </div>
      </Container>
    </section>
  );
}
