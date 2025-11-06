import * as Sentry from '@sentry/nextjs';

import { env } from './env';

type CaptureContext = {
  context?: string;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
};

type AsyncHandler<TArgs extends unknown[], TResult> = (
  ..._args: TArgs
) => Promise<TResult> | TResult;

const sentryEnabled = Boolean(env.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN);

export const captureException = (error: unknown, context?: CaptureContext) => {
  if (!sentryEnabled) {
    return;
  }

  Sentry.captureException(error, {
    tags: context?.tags,
    extra: {
      ...context?.extra,
      context: context?.context,
    },
  });
};

export const withSentry = <TArgs extends unknown[], TResult>(
  name: string,
  handler: AsyncHandler<TArgs, TResult>
): AsyncHandler<TArgs, TResult> => {
  if (!sentryEnabled) {
    return async (...args: TArgs) => handler(...args);
  }

  return async (...args: TArgs) => {
    return Sentry.startSpan({ name }, async () => {
      try {
        return await handler(...args);
      } catch (error) {
        captureException(error, {
          context: name,
        });
        throw error;
      }
    });
  };
};

export const createInstrumentedServerAction = <TArgs extends unknown[], TResult>(
  name: string,
  handler: AsyncHandler<TArgs, TResult>
) => withSentry(name, handler);

export const withSentryRouteHandler = <TArgs extends unknown[], TResult>(
  name: string,
  handler: AsyncHandler<TArgs, TResult>
) => withSentry(name, handler);

export const sentry = {
  enabled: sentryEnabled,
  captureException,
  withSentry,
  createInstrumentedServerAction,
  withSentryRouteHandler,
};
