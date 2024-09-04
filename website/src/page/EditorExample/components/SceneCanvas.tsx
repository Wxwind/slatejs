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
    deerEngine.setContainerId(DEER_ENGINE_SCENE);
    const scene = deerEngine.createScene('Empty Scene', 'editor');
    scene?.loadHDR('/hdr/default.hdr');
    return () => {
      if (scene) {
        deerEngine.deleteScene(scene.id);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative" id={DEER_ENGINE_SCENE}>
      <div
        className={classNames(
          'absolute w-full h-full pointer-events-none',
          isInControlledMode && 'border-4 border-red-400'
        )}
      ></div>
    </div>
  );
};
