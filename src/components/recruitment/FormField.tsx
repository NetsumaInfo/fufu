import { ReactElement, ReactNode, cloneElement } from 'react';

import { FormMessage } from '@/components/ui/FormMessage';

export type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  helperText?: ReactNode;
  error?: string;
  className?: string;
  children: ReactElement;
};

export function FormField({
  id,
  label,
  required,
  helperText,
  error,
  className,
  children,
}: FormFieldProps) {
  const messageId = error ? `${id}-error` : helperText ? `${id}-helper` : undefined;

  const controlProps: Record<string, unknown> = {
    id,
    'aria-invalid': Boolean(error),
  };

  if (messageId) {
    controlProps['aria-describedby'] = messageId;
  }
  if (required) {
    controlProps['required'] = true;
    controlProps['aria-required'] = true;
  }

  const control = cloneElement(children, controlProps);

  const labelClasses =
    'flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-solo-300';
  const wrapperClasses = ['flex flex-col gap-2', className].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      <label htmlFor={id} className={labelClasses}>
        <span>{label}</span>
        {required ? <span className="text-[10px] text-solo-glow">Required</span> : null}
      </label>
      {control}
      <FormMessage id={messageId} tone={error ? 'error' : 'neutral'}>
        {error ?? helperText}
      </FormMessage>
    </div>
  );
}
