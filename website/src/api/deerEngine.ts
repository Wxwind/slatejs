import { DEER_ENGINE_SCENE } from '@/hooks/config';
import { useBindSignal, useDumbState } from '@/hooks';
import { DeerEngine, SceneManager } from 'deer-engine';
import { useEngineStore } from '@/store';

export const getScene = (deerEngine: DeerEngine, sceneId: string = DEER_ENGINE_SCENE) => {
  return deerEngine.getManager(SceneManager).getScene(sceneId);
};

export const useGetActiveScene = () => {
  const { engine } = useEngineStore();
  const refresh = useDumbState();
  const sceneManager = engine?.getManager(SceneManager);
  useBindSignal(sceneManager?.signals.activeSceneUpdated, refresh);
  return sceneManager?.activeScene;
};
