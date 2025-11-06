import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export type ContainerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function Container<T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...rest
}: ContainerProps<T>) {
  const Component = (as ?? 'div') as ElementType;
  const composed = ['mx-auto w-full max-w-6xl px-6 md:px-10', className].filter(Boolean).join(' ');

  return (
    <Component className={composed} {...rest}>
      {children}
    </Component>
  );
}
