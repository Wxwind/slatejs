import { DEER_ENGINE_SCENE } from '@/config';
import { DeerEngine } from 'deer-engine';

export const getScene = (sceneId: string = DEER_ENGINE_SCENE) => {
  return DeerEngine.instance.getScene(sceneId);
};
