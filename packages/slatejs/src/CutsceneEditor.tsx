import { FC, useEffect } from 'react';
import { Controls } from './Controls';
import { Timeline } from './Timeline';
import { Cutscene } from './core';
import { CutsceneGroupPanel } from './CutsceneGroupPanel';
import { useStore } from './hooks';

export interface CutsceneEditorProps {
  /**
   * cutscene can be used only for fetch store or add/remove event listerner.
   */
  cutscene: Cutscene;
}

export const CutsceneEditor: FC<CutsceneEditorProps> = (props) => {
  const { cutscene } = props;
  const sceneData = useStore(cutscene.cutsceneDataStore);

  useEffect(() => {
    window.addEventListener('resize', cutscene.signals.windowResized.emit);
    cutscene.signals.windowResized.emit();
    return () => {
      window.removeEventListener('resize', cutscene.signals.windowResized.emit);
    };
  }, [cutscene.signals.windowResized]);

  return (
    <div className="cutscene-editor">
      <div className="cutscene-editor-left-panel">
        <Controls cutscene={cutscene} />
        {sceneData?.data.map((a) => (
          <CutsceneGroupPanel cutscene={cutscene} data={a} />
        ))}
      </div>
      <div className="cutscene-editor-right-panel">
        <Timeline cutscene={cutscene} />
      </div>
    </div>
  );
};
