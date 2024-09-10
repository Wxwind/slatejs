import { DEER_ENGINE_CONTAINER } from '@/hooks/config';
import { useBindSignal, useDumbState } from '@/hooks';
import { DeerEngine, SceneManager } from 'deer-engine';
import { useEngineStore } from '@/store';

export const useGetActiveScene = () => {
  const { engine } = useEngineStore();
  const refresh = useDumbState();
  const sceneManager = engine?.getManager(SceneManager);
  useBindSignal(sceneManager?.signals.sceneUpdated, refresh);
  return sceneManager?.mainScene;
};
