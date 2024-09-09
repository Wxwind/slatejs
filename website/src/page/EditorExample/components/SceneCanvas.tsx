import { useBindSignal } from '@/hooks';
import { DEER_ENGINE_SCENE } from '@/hooks/config';
import classNames from 'classnames';
import { DeerEngine, SceneManager, cutsceneEditor } from 'deer-engine';
import { FC, useEffect, useState } from 'react';

export const SceneCanvas: FC = (props) => {
  const [isInControlledMode, setIsInControlledMode] = useState(false);

  useBindSignal(cutsceneEditor.cutscene.signals.currentTimeUpdated, (currentTime) => {
    setIsInControlledMode(currentTime > 0);
  });

  useEffect(() => {
    const deerEngine = new DeerEngine();
    deerEngine.setContainerId(DEER_ENGINE_SCENE);
    const sceneManager = deerEngine.getManager(SceneManager);
    const scene = sceneManager.createScene('Empty Scene', 'editor');
    scene?.loadHDR('/hdr/default.hdr');
    return () => {
      deerEngine.destroy();
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
