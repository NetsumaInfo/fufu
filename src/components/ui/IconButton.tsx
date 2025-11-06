import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type IconButtonVariant = 'default' | 'ghost';
type IconButtonSize = 'md' | 'lg';

type CommonIconButtonProps = {
  children: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  className?: string;
};

type AnchorIconButtonProps = CommonIconButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
  };

type NativeIconButtonProps = CommonIconButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
  };

export type IconButtonProps = AnchorIconButtonProps | NativeIconButtonProps;

const baseClass =
  'inline-flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solo-glow focus-visible:ring-offset-2 focus-visible:ring-offset-solo-void transition';

const variantClasses: Record<IconButtonVariant, string> = {
  default: 'solo-border solo-backdrop text-solo-200 hover:text-white',
  ghost: 'border border-transparent text-solo-200 hover:text-white',
};

const sizeClasses: Record<IconButtonSize, string> = {
  md: 'size-11',
  lg: 'size-12',
};

function composeClasses(variant: IconButtonVariant, size: IconButtonSize, className?: string) {
  return [baseClass, variantClasses[variant], sizeClasses[size], className].filter(Boolean).join(' ');
}

export function IconButton({
  as = 'button',
  variant = 'default',
  size = 'md',
  className,
  children,
  ...rest
}: IconButtonProps) {
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
