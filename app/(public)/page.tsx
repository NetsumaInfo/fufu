import { Suspense } from 'react';

import { GallerySection } from '@/components/gallery/GallerySection';
import { GallerySkeleton } from '@/components/gallery/GallerySkeleton';
import { HeroSection } from '@/components/hero/HeroSection';
import { StickyNav } from '@/components/navigation/StickyNav';
import { RecruitSection } from '@/components/recruitment/RecruitSection';
import { TeamSection } from '@/components/team/TeamSection';
import { getAmvList } from '@/lib/youtube';

export default function HomePage() {
  const amvListPromise = getAmvList();

  return (
    <>
      <StickyNav />
      <main className="flex-1">
        <div className="flex flex-col scroll-snap-parent">
          <HeroSection />
          <Suspense fallback={<GallerySkeleton />}>
            <GallerySection amvListPromise={amvListPromise} />
          </Suspense>
          <TeamSection />
          <RecruitSection />
        </div>
      </main>
    </>
  );
}
