import { FC, useState } from 'react';
import { CutsceneTrack } from 'deer-engine';
import { TimelineActionClip } from './TimelineActionClip';
import { useScaleStore } from './store';
import { useBindSignal, useDumbState } from '@/hooks';
import { ContextListItem, ProContextMenu } from '@/components';

interface TimelineTracksProps {
  width: number;
  object: CutsceneTrack;
}

const TimelineTracksPanel: FC<TimelineTracksProps> = (props) => {
  const { width, object } = props;
  const { scale } = useScaleStore();
  const [offsetX, setOffsetX] = useState(0);

  const refresh = useDumbState();
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
        <TimelineActionClip key={a.id} object={a} />
      ))}
    </div>
  );
};

export default TimelineTracksPanel;
