import { ComponentPropsWithoutRef, ReactNode } from 'react';

type ChipVariant = 'default' | 'glow';

type ChipProps = {
  children: ReactNode;
  variant?: ChipVariant;
  className?: string;
} & ComponentPropsWithoutRef<'span'>;

const baseClasses =
  'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.45em] transition';

const variantClasses: Record<ChipVariant, string> = {
  default: 'border-white/15 bg-white/5 text-solo-200',
  glow: 'border-solo-glow/40 bg-solo-glow/10 text-white shadow-card-glow',
};

export function Chip({ children, className, variant = 'default', ...rest }: ChipProps) {
  const composed = [baseClasses, variantClasses[variant], className].filter(Boolean).join(' ');

  return (
    <span className={composed} {...rest}>
      {children}
    </span>
  );
}

