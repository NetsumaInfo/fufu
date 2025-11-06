import { forwardRef, InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

const baseClass =
  'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-solo-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-solo-void disabled:cursor-not-allowed disabled:opacity-40';

const invalidClass = 'border-solo-ember/70 focus-visible:ring-solo-ember';
const validClass = 'focus-visible:ring-solo-glow';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid = false, type = 'text', ...rest },
  ref
) {
  const composed = [baseClass, invalid ? invalidClass : validClass, className]
    .filter(Boolean)
    .join(' ');

  return <input ref={ref} className={composed} type={type} {...rest} />;
});
