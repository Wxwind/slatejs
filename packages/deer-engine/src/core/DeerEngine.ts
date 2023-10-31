import { isNil } from '@/util';
import { DeerScene } from './DeerScene';

export class DeerEngine {
  static instance = new DeerEngine();

  private sceneMap = new Map<string, DeerScene>();

  createScene = (containerId: string, defaulteHDRUrl: string) => {
    const scene = new DeerScene(containerId, defaulteHDRUrl);
    this.sceneMap.set(containerId, scene);
  };

  getScene = (id: string) => {
    return this.sceneMap.get(id);
  };

  deleteScene = (id: string) => {
    const scene = this.sceneMap.get(id);
    if (isNil(scene)) return;
    scene.dispose();
    return this.sceneMap.delete(id);
  };
}
