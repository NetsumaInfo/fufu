import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function RecruitShell() {
  return (
    <section
      id="recruit"
      className="relative border-t border-white/5 py-28 pb-32 scroll-snap-section sm:py-32 lg:py-40"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-tr from-solo-dusk via-transparent to-solo-ember/10" />
        <div className="absolute inset-0 bg-solo-mesh" />
      </div>
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Recruit"
          title="Join The Collective"
          description="An interactive form, honeypot field, and fan-out notifications will live here in Task 08 and Task 09. This placeholder validates scroll anchoring and ensures enough vertical rhythm for the future form."
        />
        <div className="bg-solo-panel/80 rounded-3xl border border-white/10 p-8 shadow-portal backdrop-blur">
          <p className="text-base text-solo-200">
            Recruitment CTA copy, form controls, and success states will plug into this surface.
            Continue refining metadata, gradients, and section IDs from today to keep the future
            implementation seamless.
          </p>
        </div>
      </Container>
    </section>
  );
}
