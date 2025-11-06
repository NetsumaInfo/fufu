import { Container } from './Container';

export type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'mx-auto text-center' : 'text-left';
  const composed = ['flex flex-col gap-3', alignment, className].filter(Boolean).join(' ');

  return (
    <Container className={composed}>
      <p className="text-sm uppercase tracking-[0.4em] text-solo-400 text-glow">{eyebrow}</p>
      <h2 className="text-gradient font-accent text-3xl sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-balance text-base text-solo-200 lg:text-lg">{description}</p>
      ) : null}
    </Container>
  );
}
