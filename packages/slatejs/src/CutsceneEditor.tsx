import { FC, useEffect, useState } from 'react';
import { Controls } from './Controls';
import { Timeline } from './Timeline';
import { cutscene } from './core';
import { CutsceneGroupPanel } from './CutsceneGroupPanel';
import { useStore } from './hooks';
import classNames from 'classnames';
import { UUID_PREFIX_ENTITY } from 'deer-engine';

export interface CutsceneEditorProps {}

export const CutsceneEditor: FC<CutsceneEditorProps> = (props) => {
  const [isSthDraggedHover, setIsSthDraggedHover] = useState(false);

  const sceneData = useStore(cutscene.cutsceneDataStore);

  const handleDropEntity = (entityId: string) => {
    cutscene.apiCenter.addGroup(entityId);
  };

  return (
    <div className="cutscene-editor">
      <div className="cutscene-editor-left-panel flex flex-col h-full">
        <Controls />
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
            <CutsceneGroupPanel key={a.id} data={a} depth={0} paddingLeft={18} />
          ))}
        </div>
      </div>
      <div className="cutscene-editor-right-panel">
        <Timeline />
      </div>
    </div>
  );
};
