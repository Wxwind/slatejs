import { FC, useEffect, useState } from 'react';
import { Controls } from './Controls';
import { Timeline } from './Timeline';
import { Cutscene } from './core';
import { CutsceneGroupPanel } from './CutsceneGroupPanel';
import { useStore } from './hooks';
import classNames from 'classnames';
import { UUID_PREFIX_ENTITY } from 'deer-engine';

export interface CutsceneEditorProps {
  /**
   * cutscene can be used only for fetch store or add/remove event listerner.
   */
  cutscene: Cutscene;
}

export const CutsceneEditor: FC<CutsceneEditorProps> = (props) => {
  const { cutscene } = props;
  const [isSthDraggedHover, setIsSthDraggedHover] = useState(false);

  const sceneData = useStore(cutscene.cutsceneDataStore);

  useEffect(() => {
    window.addEventListener('resize', cutscene.signals.windowResized.emit);
    cutscene.signals.windowResized.emit();
    return () => {
      window.removeEventListener('resize', cutscene.signals.windowResized.emit);
    };
  }, [cutscene.signals.windowResized]);

  const handleDropEntity = (entityId: string) => {
    cutscene.apiCenter.addGroup(entityId);
  };

  return (
    <div className="cutscene-editor">
      <div className="cutscene-editor-left-panel flex flex-col h-full">
        <Controls cutscene={cutscene} />
        <div
          className={classNames(
            'flex-1',
            'cursor-pointer flex flex-col border border-solid rounded text-white',
            isSthDraggedHover ? 'border-primary bg-red-300' : 'border-transparent'
          )}
          onDrop={(ev) => {
            setIsSthDraggedHover(false);
            const entityId = ev.dataTransfer.getData('text');
            if (entityId.startsWith(UUID_PREFIX_ENTITY)) {
              handleDropEntity(entityId);
            }
          }}
          onDragOver={(ev) => {
            ev.preventDefault();
          }}
          onDragEnter={(ev) => {
            if (!ev.dataTransfer.getData('text/plain').startsWith(UUID_PREFIX_ENTITY)) {
              ev.dataTransfer.dropEffect = 'none';
            } else setIsSthDraggedHover(true);
          }}
          onDragLeave={(ev) => {
            setIsSthDraggedHover(false);
          }}
        >
          {sceneData?.data.map((a) => (
            <CutsceneGroupPanel key={a.id} cutscene={cutscene} data={a} />
          ))}
        </div>
      </div>
      <div className="cutscene-editor-right-panel">
        <Timeline cutscene={cutscene} />
      </div>
    </div>
  );
};
