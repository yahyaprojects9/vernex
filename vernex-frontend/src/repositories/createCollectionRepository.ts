export interface CollectionRepository<T extends { id: string }> {
  list(): T[];
  create(record: T): T;
  update(id: string, patch: Partial<T>): void;
  delete(id: string): void;
}

export function createCollectionRepository<TStore, K extends keyof TStore, T extends { id: string }>(
  collection: K,
  read: () => TStore,
  write: (store: TStore) => void
): CollectionRepository<T> {
  return {
    list: () => read()[collection] as T[],
    create: (record) => {
      const store = read();
      (store[collection] as T[]).unshift(record);
      write(store);
      return record;
    },
    update: (id, patch) => {
      const store = read();
      store[collection] = (store[collection] as T[]).map((record) =>
        record.id === id ? { ...record, ...patch } : record
      ) as TStore[K];
      write(store);
    },
    delete: (id) => {
      const store = read();
      store[collection] = (store[collection] as T[]).filter((record) => record.id !== id) as TStore[K];
      write(store);
    }
  };
}
