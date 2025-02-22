import { FC } from 'react';
import { CutsceneEditor, CutsceneGroup } from 'deer-engine';
import { TimelineTracksPanel } from './TimelineTrackPanel';
import { useDumbState, useBindSignal } from '@/hooks';

interface TimelineGroupPanelProps {
  width: number;
  object: CutsceneGroup;
  cutsceneEditor: CutsceneEditor;
}

export const TimelineGroupPanel: FC<TimelineGroupPanelProps> = (props) => {
  const { width, object, cutsceneEditor } = props;

  const refresh = useDumbState();
  useBindSignal(object.signals.trackCountChanged, refresh);
  useBindSignal(object.signals.groupUpdated, refresh);

  return (
    <div style={{ width: `${width}px` }}>
      <div className="flex items-center h-8">{object.name}</div>
      <div className="flex flex-col gap-y-1">
        {object.children.map((a) => (
          <TimelineTracksPanel key={a.id} width={width} object={a} cutsceneEditor={cutsceneEditor} />
        ))}
      </div>
    </div>
  );
};
