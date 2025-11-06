import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const placeholders = [
  {
    title: 'Shadow Monarch',
    copy: 'Placeholder AMV card. Future implementation will render synced content from the YouTube cache.',
  },
  {
    title: "Hunter's Oath",
    copy: 'Expect hover reveals, dynamic stats, and CTA overlays once the AMV gallery lands in Task 07.',
  },
  {
    title: 'Arise',
    copy: 'Glassmorphism treatment demonstrates spacing for eventual video metadata and callouts.',
  },
];

export function GalleryShell() {
  return (
    <section
      id="gallery"
      className="relative border-t border-white/5 py-28 scroll-snap-section sm:py-32 lg:py-36"
    >
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Gallery"
          title="AMV Constellation"
          description="This grid will hydrate with live YouTube data fetched via Vercel KV. Today it simply holds the spatial rhythm for cards, gradients, and portal shadows."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {placeholders.map((item) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-solo-panel p-6 shadow-portal transition-shadow duration-300 hover:shadow-portal"
            >
              <div className="absolute inset-0 opacity-30 transition group-hover:opacity-50">
                <div className="absolute inset-0 bg-solo-mesh" />
              </div>
              <div className="relative flex h-full flex-col gap-4">
                <h3 className="font-accent text-lg uppercase tracking-[0.4em] text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-solo-200">{item.copy}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-solo-glow">
                  <span className="size-2 rounded-full bg-solo-glow/60" />
                  Portal locked
                </span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
