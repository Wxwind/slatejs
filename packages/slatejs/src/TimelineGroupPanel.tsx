import { FC } from 'react';
import { GroupData } from './core';
import TimelineTracksPanel from './TimelineTrackPanel';

interface TimelineGroupPanelProps {
  width: number;
  data: GroupData;
}

export const TimelineGroupPanel: FC<TimelineGroupPanelProps> = (props) => {
  const { width, data } = props;
  return (
    <div style={{ width: `${width}px` }}>
      <div className="timeline-group-panel">{data.name}</div>
      {data.children.map((a) => (
        <TimelineTracksPanel key={a.id} width={width} groupId={a.id} data={a} />
      ))}
    </div>
  );
};
