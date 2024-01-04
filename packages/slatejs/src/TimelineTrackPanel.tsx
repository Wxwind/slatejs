import { FC, useCallback } from 'react';
import { useStore } from './hooks/useStore';
import { AnimationClip, CutsceneTrack, CutsceneTrackData, cutscene } from './core';
import { TimelineActionClip } from './TimelineActionClip';
import { Cutscene } from './core';
import { useScaleStore } from './store';
import { useBindSignal, useDumbState } from './hooks';

interface TimelineTracksProps {
  width: number;
  groupId: string;
  object: CutsceneTrack;
}

const TimelineTracksPanel: FC<TimelineTracksProps> = (props) => {
  const { width, groupId, object } = props;
  const { scale } = useScaleStore();

  const [refresh] = useDumbState();
  useBindSignal(object.signals.clipCountChanged, refresh);
  useBindSignal(object.signals.trackUpdated, refresh);

  const handleRightlick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      const start = e.nativeEvent.offsetX / scale;
      const end = start + 2;
      object.addClip('Transform', { startTime: start, endTime: end });
    },
    [object, scale]
  );

  return (
    <div style={{ width: `${width}px` }}>
      <div className="timeline-track-panel" onContextMenu={handleRightlick}></div>
      {object.children.map((a) => (
        <TimelineActionClip key={a.id} groupId={groupId} trackId={a.id} object={a} />
      ))}
    </div>
  );
};

export default TimelineTracksPanel;
