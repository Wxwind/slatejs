import { FC } from 'react';
import { CutsceneGroup } from './core';
import TimelineTracksPanel from './TimelineTrackPanel';
import { useDumbState, useBindSignal } from './hooks';

interface TimelineGroupPanelProps {
  width: number;
  object: CutsceneGroup;
}

export const TimelineGroupPanel: FC<TimelineGroupPanelProps> = (props) => {
  const { width, object } = props;

  const refresh = useDumbState();
  useBindSignal(object.signals.trackCountChanged, refresh);
  useBindSignal(object.signals.groupUpdated, refresh);

  console.log('timeline group refresh', object.children);

  return (
    <div style={{ width: `${width}px` }}>
      <div className="timeline-group-panel">{object.name}</div>
      {object.children.map((a) => (
        <TimelineTracksPanel key={a.id} width={width} groupId={a.id} object={a} />
      ))}
    </div>
  );
};
