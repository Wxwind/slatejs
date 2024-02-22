import { FC, useState } from 'react';
import { Controls } from './Controls';
import { Timeline } from './Timeline';
import { cutsceneEditor } from 'deer-engine';
import { CutsceneGroupPanel } from './CutsceneGroupPanel';
import classNames from 'classnames';
import { UUID_PREFIX_ENTITY } from 'deer-engine';
import { useBindSignal, useDumbState } from '@/hooks';

export interface CutsceneEditorPanelProps {}

export const CutsceneEditorPanel: FC<CutsceneEditorPanelProps> = (props) => {
  const [isSthDraggedHover, setIsSthDraggedHover] = useState(false);

  const refresh = useDumbState();
  useBindSignal(cutsceneEditor.cutscene.signals.groupCountUpdated, refresh);
  useBindSignal(cutsceneEditor.signals.playStateUpdated, (playState) => {
    refresh();
  });

  const handleDropEntity = (entityId: string) => {
    cutsceneEditor.cutscene.addGroup(entityId, 'Actor');
  };

  return (
    <div className="relative w-full h-full bg-[#333] flex">
      <div className="bg-[#555861] w-1/4 flex flex-col h-full">
        <Controls cutsceneEditor={cutsceneEditor} />
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
          {cutsceneEditor.cutscene.groups.map((a) => (
            <CutsceneGroupPanel key={a.id} object={a} depth={0} paddingLeft={18} />
          ))}
        </div>
      </div>
      <div className="h-full w-3/4">
        <Timeline cutsceneEditor={cutsceneEditor} />
      </div>
    </div>
  );
};
