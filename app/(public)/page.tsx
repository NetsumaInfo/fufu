import { GalleryShell } from '@/components/gallery/GalleryShell';
import { HeroSection } from '@/components/hero/HeroSection';
import { StickyNav } from '@/components/navigation/StickyNav';
import { RecruitShell } from '@/components/recruitment/RecruitShell';
import { TeamSection } from '@/components/team/TeamSection';

export default function HomePage() {
  return (
    <>
      <StickyNav />
      <main className="flex-1">
        <div className="flex flex-col scroll-snap-parent">
          <HeroSection />
          <GalleryShell />
          <TeamSection />
          <RecruitShell />
        </div>
      </main>
    </>
  );
}
