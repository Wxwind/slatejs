import { FC, useEffect } from 'react';
import Controls from './Controls';
import Timeline from './Timeline';
import { CutScene } from './core';

export interface CutSceneEditorProps {
  /**
   * cutScene can be used only for fetch store or add/remove event listerner.
   */
  cutScene: CutScene;
}

export const CutSceneEditor: FC<CutSceneEditorProps> = (props) => {
  const { cutScene } = props;

  useEffect(() => {
    window.addEventListener('resize', cutScene.signals.windowResized.emit);
    cutScene.signals.windowResized.emit();
    return () => {
      window.removeEventListener('resize', cutScene.signals.windowResized.emit);
    };
  }, [cutScene.signals.windowResized]);

  return (
    <div className="timeline-editor">
      <Controls cutScene={cutScene} />
      <Timeline cutScene={cutScene} />
    </div>
  );
};
