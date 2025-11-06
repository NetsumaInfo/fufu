import { ReactNode } from 'react';

type FormMessageTone = 'neutral' | 'error' | 'success';

type FormMessageProps = {
  id?: string;
  tone?: FormMessageTone;
  className?: string;
  children: ReactNode;
};

const toneClasses: Record<FormMessageTone, string> = {
  neutral: 'text-solo-300',
  error: 'text-solo-ember',
  success: 'text-solo-glow',
};

export function FormMessage({ id, tone = 'neutral', className, children }: FormMessageProps) {
  if (!children) {
    return null;
  }

  const composed = ['text-xs', 'font-medium', toneClasses[tone], className].filter(Boolean).join(' ');

  return (
    <p id={id} className={composed}>
      {children}
    </p>
  );
}
