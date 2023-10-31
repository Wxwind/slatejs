import { DeerEngine, DeerScene } from 'deer-engine';
import { FC, useEffect } from 'react';

interface SceneCanvasProps {}

export const SceneCanvas: FC<SceneCanvasProps> = (props) => {
  const {} = props;

  useEffect(() => {
    DeerEngine.instance.createScene('eg-scene', '/hdr/default.hdr');
    return () => {
      DeerEngine.instance.deleteScene('eg-scene');
    };
  }, []);

  return <div className="w-full h-full" id="eg-scene"></div>;
};
