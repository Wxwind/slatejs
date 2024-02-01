import { DEER_ENGINE_SCENE } from '@/hooks/config';
import { deerEngine } from 'deer-engine';
import { FC, useEffect } from 'react';

export const SceneCanvas: FC = (props) => {
  useEffect(() => {
    const scene = deerEngine.createScene(DEER_ENGINE_SCENE, '/hdr/default.hdr');
    deerEngine.activeScene = scene;
    return () => {
      deerEngine.deleteScene(DEER_ENGINE_SCENE);
    };
  }, []);

  return <div className="w-full h-full" id="eg-scene"></div>;
};
