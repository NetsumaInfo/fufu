import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'md' | 'lg';

type CommonButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type AnchorButtonProps = CommonButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
  };

type NativeButtonProps = CommonButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
  };

export type ButtonProps = AnchorButtonProps | NativeButtonProps;

const baseClass =
  'inline-flex items-center justify-center gap-3 rounded-full font-semibold uppercase tracking-[0.45em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solo-glow focus-visible:ring-offset-2 focus-visible:ring-offset-solo-void transition';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-solo-500 via-solo-glow to-solo-ember text-solo-void shadow-portal hover:brightness-110',
  secondary:
    'glass-ring bg-glass text-white hover:shadow-portal focus-visible:ring-offset-0',
  ghost:
    'border border-solo-200/40 text-solo-200 hover:border-solo-glow/70 hover:text-white focus-visible:ring-offset-0',
};

const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-6 py-3 text-[0.7rem]',
  lg: 'px-9 py-4 text-sm md:text-base',
};

function composeClasses(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return [baseClass, variantClasses[variant], sizeClasses[size], className].filter(Boolean).join(' ');
}

export function Button({
  as = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  const composed = composeClasses(variant, size, className);

  if (as === 'a') {
    return (
      <a className={composed} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={buttonProps.type ?? 'button'} className={composed} {...buttonProps}>
      {children}
    </button>
  );
}
