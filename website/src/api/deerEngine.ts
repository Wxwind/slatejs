import { DEER_ENGINE_SCENE } from '@/hooks/config';
import { useBindSignal, useDumbState } from '@/hooks';
import { deerEngine } from 'deer-engine';

export const getScene = (sceneId: string = DEER_ENGINE_SCENE) => {
  return deerEngine.getScene(sceneId);
};

export const useGetActiveScene = () => {
  const refresh = useDumbState();
  useBindSignal(deerEngine.signals.activeSceneUpdated, refresh);
  return deerEngine.activeScene;
};
