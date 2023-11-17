import { DEER_ENGINE_SCENE } from '@/config';
import { isNil } from '@/util';
import { DeerEngine } from 'deer-engine';

export const getScene = (sceneId: string = DEER_ENGINE_SCENE) => {
  return DeerEngine.instance.getScene(sceneId);
};

export const getActiveScene = () => {
  return DeerEngine.instance.activeScene;
};

export const getEngineApi = () => {
  const scene = DeerEngine.instance.activeScene;
  if (isNil(scene)) return;
  return scene.commandManager;
};
