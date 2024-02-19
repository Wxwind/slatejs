import { useBindSignal } from '@/hooks';
import { DEER_ENGINE_SCENE } from '@/hooks/config';
import classNames from 'classnames';
import { cutsceneEditor, deerEngine } from 'deer-engine';
import { FC, useEffect, useState } from 'react';

export const SceneCanvas: FC = (props) => {
  const [isInControlledMode, setIsInControlledMode] = useState(false);

  useBindSignal(cutsceneEditor.cutscene.signals.currentTimeUpdated, (currentTime) => {
    setIsInControlledMode(currentTime > 0);
  });

  useEffect(() => {
    const scene = deerEngine.createScene(DEER_ENGINE_SCENE, '/hdr/default.hdr');
    deerEngine.activeScene = scene;
    return () => {
      deerEngine.deleteScene(DEER_ENGINE_SCENE);
    };
  }, []);

  return (
    <div className="w-full h-full relative" id="eg-scene">
      <div className={classNames('absolute w-full h-full', isInControlledMode && 'border-4 border-red-400')}></div>
    </div>
  );
};
