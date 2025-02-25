import { FC, memo, useMemo } from 'react';
import { Controls } from './Controls';
import { Timeline } from './Timeline';
import { CutsceneGroupPanel } from './CutsceneGroupPanel';
import classNames from 'classnames';
import { UUID_PREFIX_ENTITY } from 'deer-engine';
import { useBindSignal, useDumbState } from '@/hooks';
import { useDrop } from 'react-dnd';
import { DndEntityDragObject, DragDropItemId } from '@/constants';
import { useCutsceneEditorStore } from '@/store';

export interface CutsceneEditorPanelProps {}

export const CutsceneEditorPanel: FC<CutsceneEditorPanelProps> = (props) => {
  const { cutsceneEditor } = useCutsceneEditorStore();
  const refresh = useDumbState();
  useBindSignal(cutsceneEditor?.cutscene.signals.groupCountUpdated, refresh);
  useBindSignal(cutsceneEditor?.signals.playStateUpdated, (playState) => {
    refresh();
  });

  const handleDropEntity = (entityId: string) => {
    cutsceneEditor?.cutscene.addGroup(entityId, 'Actor');
  };

  const [{ isOver }, drop] = useDrop({
    accept: DragDropItemId.Entity,
    canDrop: (dragObj) => {
      const { entityId } = dragObj as DndEntityDragObject;
      return entityId.startsWith(UUID_PREFIX_ENTITY);
    },
    drop: (dragObj) => {
      const { entityId } = dragObj as DndEntityDragObject;
      handleDropEntity(entityId);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div className="relative w-full h-full bg-[#333] flex">
      {cutsceneEditor ? (
        <>
          <div className="bg-[#555861] w-1/4 flex flex-col h-full">
            <Controls cutsceneEditor={cutsceneEditor} />
            <div
              ref={drop}
              className={classNames(
                'flex-1',
                'cursor-pointer flex flex-col border border-solid rounded text-white',
                isOver ? 'border-primary bg-red-300' : 'border-transparent'
              )}
            >
              {cutsceneEditor.cutscene.groups.map((a) => (
                <CutsceneGroupPanel key={a.id} object={a} depth={0} paddingLeft={18} />
              ))}
            </div>
          </div>
          <div className="h-full w-3/4">
            <Timeline cutsceneEditor={cutsceneEditor} />
          </div>
        </>
      ) : (
        <div>cutSceneEditor is invalid</div>
      )}
    </div>
  );
};

export const CutsceneEditorPanelMemo = memo(CutsceneEditorPanel);
