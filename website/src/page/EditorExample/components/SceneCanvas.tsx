import { DEER_ENGINE_SCENE } from '@/config';
import { DeerEngine } from 'deer-engine';
import { FC, useEffect } from 'react';

export const SceneCanvas: FC = (props) => {
  useEffect(() => {
    DeerEngine.instance.createScene(DEER_ENGINE_SCENE, '/hdr/default.hdr');
    return () => {
      DeerEngine.instance.deleteScene(DEER_ENGINE_SCENE);
    };
  }, []);

  return <div className="w-full h-full" id="eg-scene"></div>;
};
