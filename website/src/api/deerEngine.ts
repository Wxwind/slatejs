import { DEER_ENGINE_SCENE } from '@/hooks/config';
import { useBindSignal, useDumbState } from '@/hooks';
import { SceneManager, deerEngine } from 'deer-engine';

export const getScene = (sceneId: string = DEER_ENGINE_SCENE) => {
  return deerEngine.getManager(SceneManager).getScene(sceneId);
};

export const useGetActiveScene = () => {
  const refresh = useDumbState();
  const sceneManager = deerEngine.getManager(SceneManager);
  useBindSignal(sceneManager.signals.activeSceneUpdated, refresh);
  return sceneManager.activeScene;
};
