import { Engine } from 'engine-threejs';
import { FC, useEffect } from 'react';

interface SceneCanvasProps {}

export const SceneCanvas: FC<SceneCanvasProps> = (props) => {
  const {} = props;
  useEffect(() => {
    const engine = new Engine('engine', '/hdr/default.hdr');

    return () => {
      engine.dispose();
    };
  }, []);

  return <div className="w-full h-full" id="engine"></div>;
};
