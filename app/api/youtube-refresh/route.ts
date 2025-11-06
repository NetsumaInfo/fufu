import { env } from '@/lib/env';
import {
  cronFailure,
  cronSuccess,
  methodNotAllowedResponse,
  parseBearerToken,
  unauthorizedResponse,
  withCronHandler,
} from '@/lib/cron';
import { refreshAmvList } from '@/lib/youtube';

const TASK_NAME = 'youtube-refresh';
const ALLOWED_METHODS = ['GET', 'POST'];

const handler = withCronHandler(TASK_NAME, async (request: Request) => {
  if (!ALLOWED_METHODS.includes(request.method)) {
    return methodNotAllowedResponse(TASK_NAME, ALLOWED_METHODS);
  }

  if (!env.ADMIN_REFRESH_TOKEN) {
    return cronFailure(TASK_NAME, 500, 'ADMIN_REFRESH_TOKEN is not configured.', {
      meta: { reason: 'missing-admin-refresh-token' },
    });
  }

  const token = parseBearerToken(request);
  if (!token || token !== env.ADMIN_REFRESH_TOKEN) {
    return unauthorizedResponse(TASK_NAME, 'Invalid or missing bearer token.');
  }

  const result = await refreshAmvList();

  if (result.ok) {
    const meta: Record<string, unknown> = {
      ...result.meta,
      source: result.source,
      syncedAt: result.syncedAt,
    };

    if (result.error) {
      meta.error = result.error;
    }

    return cronSuccess(TASK_NAME, result.message, meta);
  }

  return cronFailure(TASK_NAME, 500, result.message, {
    error: result.error,
    meta: {
      source: result.source,
      syncedAt: result.syncedAt,
    },
  });
});

export { handler as GET, handler as POST };
export const runtime = 'edge';
