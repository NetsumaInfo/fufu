type Entry = {
  value: string;
  expiresAt: number | null;
};

export const createInMemoryKv = () => {
  const store = new Map<string, Entry>();

  return {
    async get(key: string) {
      const entry = store.get(key);
      if (!entry) {
        return null;
      }

      if (entry.expiresAt && entry.expiresAt <= Date.now()) {
        store.delete(key);
        return null;
      }

      return entry.value;
    },
    async set(key: string, value: string, options?: { ttl?: number }) {
      const expiresAt = options?.ttl ? Date.now() + options.ttl * 1000 : null;
      store.set(key, { value, expiresAt });
    },
    async delete(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
};
