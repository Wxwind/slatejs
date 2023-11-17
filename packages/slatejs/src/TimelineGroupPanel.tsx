import { FC } from 'react';
import { Cutscene, GroupData } from './core';
import TimelineTracksPanel from './TimelineTrackPanel';

interface TimelineGroupPanelProps {
  width: number;
  cutscene: Cutscene;
  data: GroupData;
}

export const TimelineGroupPanel: FC<TimelineGroupPanelProps> = (props) => {
  const { width, cutscene, data } = props;
  return (
    <div style={{ width: `${width}px` }}>
      <div className="timeline-group-panel">{data.name}</div>
      {data.children.map((a) => (
        <TimelineTracksPanel width={width} cutscene={cutscene} data={a} />
      ))}
    </div>
  );
};
