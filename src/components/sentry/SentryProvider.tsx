'use client';

import type { ReactElement, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

type SentryProviderProps = {
  children: ReactNode;
  fallback?: ReactElement;
};

const DefaultFallback = () => <></>;

export function SentryProvider({ children, fallback }: SentryProviderProps) {
  return (
    <Sentry.ErrorBoundary fallback={fallback ?? <DefaultFallback />}>
      {children}
    </Sentry.ErrorBoundary>
  );
}
