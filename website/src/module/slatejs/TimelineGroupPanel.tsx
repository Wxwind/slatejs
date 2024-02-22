import { FC } from 'react';
import { CutsceneGroup } from 'deer-engine';
import TimelineTracksPanel from './TimelineTrackPanel';
import { useDumbState, useBindSignal } from '@/hooks';

interface TimelineGroupPanelProps {
  width: number;
  object: CutsceneGroup;
}

export const TimelineGroupPanel: FC<TimelineGroupPanelProps> = (props) => {
  const { width, object } = props;

  const refresh = useDumbState();
  useBindSignal(object.signals.trackCountChanged, refresh);
  useBindSignal(object.signals.groupUpdated, refresh);

  return (
    <div style={{ width: `${width}px` }}>
      <div className="flex items-center h-8">{object.name}</div>
      <div className="flex flex-col gap-y-1">
        {object.children.map((a) => (
          <TimelineTracksPanel key={a.id} width={width} object={a} />
        ))}
      </div>
    </div>
  );
};
