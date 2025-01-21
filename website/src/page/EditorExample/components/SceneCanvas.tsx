import { useGetActiveScene } from '@/api';
import { useBindSignal } from '@/hooks';
import { DEER_ENGINE_CONTAINER } from '@/hooks/config';
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
    let deerEngine: DeerEngine;
    let cutsceneEditor: CutsceneEditor;
    const initEngine = async () => {
      deerEngine = await DeerEngine.create({
        containerId: DEER_ENGINE_CONTAINER,
      });
      deerEngine.getManager(FileManager).addBuiltinFile({
        '/hdr/default.hdr': '/hdr/default.hdr',
        '/model/people.glb': '/model/people.glb',
      });
      const sceneManager = deerEngine.getManager(SceneManager);
      const scene = sceneManager.createScene('Empty Scene', 'editor');
      sceneManager.mainScene = scene;
      scene?.loadHDR('/hdr/default.hdr');
      deerEngine.run();

      cutsceneEditor = new CutsceneEditor(deerEngine);

      setCutsceneEditor(cutsceneEditor);
      setEngine(deerEngine);
      (window as any)['engine'] = deerEngine;
    };

    initEngine();
    return () => {
      deerEngine?.destroy();
      cutsceneEditor?.destroy();
      setEngine(undefined);
      setCutsceneEditor(undefined);
    };
  }, []);

  return (
    <div className="w-full h-full relative" id={DEER_ENGINE_CONTAINER}>
      <div
        className={classNames(
          'absolute w-full h-full pointer-events-none',
          isInControlledMode && 'border-4 border-red-400'
        )}
      ></div>
    </div>
  );
};
