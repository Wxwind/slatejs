import { useSyncExternalStore } from 'react';
import { StoreBase } from '../store/StoreBase';

export const useStore = <T>(store: StoreBase<T>) => {
  const data = useSyncExternalStore(store.subscribe, store.getData);
  return data;
};
