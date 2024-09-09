import { useGetActiveScene } from '@/api';
import { useBindSignal } from '@/hooks';
import { DEER_ENGINE_SCENE } from '@/hooks/config';
import { useCutsceneEditorStore, useEngineStore } from '@/store';
import classNames from 'classnames';
import { CutsceneEditor, DeerEngine, FileManager, SceneManager } from 'deer-engine';
import { FC, useEffect, useState } from 'react';

export const SceneCanvas: FC = (props) => {
  const [isInControlledMode, setIsInControlledMode] = useState(false);

  const { setEngine } = useEngineStore();
  const { cutsceneEditor, setCutsceneEditor } = useCutsceneEditorStore();

  useBindSignal(cutsceneEditor?.cutscene.signals.currentTimeUpdated, (currentTime) => {
    setIsInControlledMode(currentTime > 0);
  });

  useEffect(() => {
    const deerEngine = new DeerEngine();
    deerEngine.setContainerId(DEER_ENGINE_SCENE);
    deerEngine.getManager(FileManager).addBuiltinFile({
      '/hdr/default.hdr': '/hdr/default.hdr',
    });
    const sceneManager = deerEngine.getManager(SceneManager);
    const scene = sceneManager.createScene('Empty Scene', 'editor');
    scene?.loadHDR('/hdr/default.hdr');

    const cutsceneEditor = new CutsceneEditor(deerEngine);

    setCutsceneEditor(cutsceneEditor);
    setEngine(deerEngine);
    return () => {
      deerEngine.destroy();
      cutsceneEditor.destroy();
      setEngine(undefined);
      setCutsceneEditor(undefined);
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
