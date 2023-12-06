import { FC, useCallback } from 'react';
import { useStore } from './hooks/useStore';
import { AnimationClip, TrackData, cutscene } from './core';
import { TimelineActionClip } from './TimelineActionClip';
import { Cutscene } from './core';
import { useScaleStore } from './store';

interface TimelineTracksProps {
  width: number;
  groupId: string;
  data: TrackData;
}

const TimelineTracksPanel: FC<TimelineTracksProps> = (props) => {
  const { width, groupId, data } = props;
  const { scale } = useScaleStore();

  const handleRightlick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      const start = e.nativeEvent.offsetX / scale;
      const end = start + 2;
      cutscene.apiCenter.addClip(groupId, data.id, 'Animation', { start, end, name: '123' });
    },
    [data.id, groupId, scale]
  );

  return (
    <div style={{ width: `${width}px` }}>
      <div className="timeline-track-panel" onContextMenu={handleRightlick}></div>
      {data.children.map((a) => (
        <TimelineActionClip key={a.id} groupId={groupId} trackId={a.id} data={a} />
      ))}
    </div>
  );
};

export default TimelineTracksPanel;
