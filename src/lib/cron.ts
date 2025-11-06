import { withSentryRouteHandler } from './sentry';

const jsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });

const basePayload = (task: string) => ({
  task,
  timestamp: new Date().toISOString(),
});

export type CronSuccessPayload = ReturnType<typeof basePayload> & {
  ok: true;
  message: string;
  meta?: Record<string, unknown>;
};

export type CronErrorPayload = ReturnType<typeof basePayload> & {
  ok: false;
  message: string;
  error?: string;
  meta?: Record<string, unknown>;
};

export const cronSuccess = (task: string, message: string, meta?: Record<string, unknown>) =>
  jsonResponse(200, {
    ...basePayload(task),
    ok: true,
    message,
    ...(meta ? { meta } : {}),
  });

export const cronFailure = (
  task: string,
  status: number,
  message: string,
  options: { error?: string; meta?: Record<string, unknown> } = {}
) =>
  jsonResponse(status, {
    ...basePayload(task),
    ok: false,
    message,
    ...(options.error ? { error: options.error } : {}),
    ...(options.meta ? { meta: options.meta } : {}),
  });

export const unauthorizedResponse = (task: string, message = 'Unauthorized request.') =>
  cronFailure(task, 401, message);

export const methodNotAllowedResponse = (task: string, methods: string[]) =>
  new Response(
    JSON.stringify({
      ...basePayload(task),
      ok: false,
      message: `Method not allowed. Expected ${methods.join(', ')}.`,
    }),
    {
      status: 405,
      headers: {
        'Allow': methods.join(', '),
        'Content-Type': 'application/json',
      },
    }
  );

export const parseBearerToken = (request: Request) => {
  const header = request.headers.get('authorization') ?? request.headers.get('Authorization');
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token.trim();
};

export const withCronHandler = <T extends (_request: Request) => Promise<Response>>(
  task: string,
  handler: T
) => withSentryRouteHandler(`cron:${task}`, handler);
