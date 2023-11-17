import { DEER_ENGINE_SCENE } from '@/config';
import { DeerEngine } from 'deer-engine';
import { FC, useEffect } from 'react';

export const SceneCanvas: FC = (props) => {
  useEffect(() => {
    const scene = DeerEngine.instance.createScene(DEER_ENGINE_SCENE, '/hdr/default.hdr');
    DeerEngine.instance.activeScene = scene;
    return () => {
      DeerEngine.instance.deleteScene(DEER_ENGINE_SCENE);
    };
  }, []);

  return <div className="w-full h-full" id="eg-scene"></div>;
};
