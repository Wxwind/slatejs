import { DeerEngine, StoreBase as EngineStore } from 'deer-engine';
import { StoreBase as SlateStore } from 'slatejs';
import { useSyncExternalStore } from 'react';
import { DEER_ENGINE_SCENE } from '@/config';
import { isNil } from '@/util';

export const useSlateStore = <T>(store: SlateStore<T>) => {
  const data = useSyncExternalStore(store.subscribe, store.getData);
  return data;
};

export const useEngineStore = <T>(store: EngineStore<T>) => {
  const data = useSyncExternalStore(store.subscribe, store.getData);
  return data;
};

export const useEntityStoreData = () => {
  const scene = DeerEngine.instance.getScene(DEER_ENGINE_SCENE);
  if (isNil(scene)) throw new Error('could not get scene');
  return useEngineStore(scene.entityStore);
};
