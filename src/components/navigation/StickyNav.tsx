import { PrimaryNav, NAV_SECTIONS } from './PrimaryNav';

export function StickyNav() {
  return (
    <div className="sticky top-0 z-50">
      <PrimaryNav sections={NAV_SECTIONS} />
    </div>
  );
}
