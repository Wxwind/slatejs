import { DEER_ENGINE_SCENE } from '@/config';
import { isNil } from '@/util';
import { deerEngine } from 'deer-engine';

export const getScene = (sceneId: string = DEER_ENGINE_SCENE) => {
  return deerEngine.getScene(sceneId);
};

export const getActiveScene = () => {
  return deerEngine.activeScene;
};
