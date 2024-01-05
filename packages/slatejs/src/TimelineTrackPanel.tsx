import { FC, useCallback, useState } from 'react';
import { useStore } from './hooks/useStore';
import { AnimationClip, CutsceneTrack, CutsceneTrackData, cutscene } from './core';
import { TimelineActionClip } from './TimelineActionClip';
import { Cutscene } from './core';
import { useScaleStore } from './store';
import { useBindSignal, useDumbState } from './hooks';
import { ContextListItem, ProContextMenu } from './ui/components';

interface TimelineTracksProps {
  width: number;
  groupId: string;
  object: CutsceneTrack;
}

const TimelineTracksPanel: FC<TimelineTracksProps> = (props) => {
  const { width, groupId, object } = props;
  const { scale } = useScaleStore();
  const [offsetX, setOffsetX] = useState(0);

  const [refresh] = useDumbState();
  useBindSignal(object.signals.clipCountChanged, refresh);
  useBindSignal(object.signals.trackUpdated, refresh);

  const contextList: ContextListItem[] = [
    {
      name: 'add transform clip',
      onSelect: () => {
        const start = offsetX / scale;
        const end = start + 2;
        object.addClip('Transform', { startTime: start, endTime: end });
      },
    },
  ];

  return (
    <div style={{ width: `${width}px`, height: '32px', position: 'relative' }}>
      <div className="timeline-track-panel">
        <ProContextMenu list={contextList}>
          <div
            className="w-full h-full"
            onContextMenu={(e) => {
              setOffsetX(e.nativeEvent.offsetX);
            }}
          ></div>
        </ProContextMenu>
      </div>
      {object.children.map((a) => (
        <TimelineActionClip key={a.id} groupId={groupId} trackId={a.id} object={a} />
      ))}
    </div>
  );
};

export default TimelineTracksPanel;
