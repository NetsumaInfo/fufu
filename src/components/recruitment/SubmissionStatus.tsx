import { FormMessage } from '@/components/ui/FormMessage';
import type { FormStatus } from '@/lib/forms';

type SubmissionStatusProps = {
  status: FormStatus;
  message: string | null;
};

export function SubmissionStatus({ status, message }: SubmissionStatusProps) {
  if (status === 'idle' || !message) {
    return null;
  }

  const tone = status === 'success' ? 'success' : 'error';
  const live = status === 'success' ? 'polite' : 'assertive';

  return (
    <div aria-live={live}>
      <FormMessage tone={tone}>{message}</FormMessage>
    </div>
  );
}
