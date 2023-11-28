import { StoreBase as EngineStore } from 'deer-engine';
import { StoreBase as SlateStore } from 'slatejs';
import { useSyncExternalStore } from 'react';

export const useSlateStore = <T>(store: SlateStore<T>) => {
  const data = useSyncExternalStore(store.subscribe, store.getData);
  return data;
};

export const useEngineStore = <T>(store: EngineStore<T>) => {
  const data = useSyncExternalStore(store.subscribe, store.getData);
  return data;
};
