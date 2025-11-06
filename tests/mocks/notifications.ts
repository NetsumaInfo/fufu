export const createNotificationRecorder = () => {
  const events: Array<Record<string, unknown>> = [];

  return {
    record(event: Record<string, unknown>) {
      events.push(event);
    },
    flush() {
      const snapshot = [...events];
      events.length = 0;
      return snapshot;
    },
  };
};
