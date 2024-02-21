import { FC, useState } from 'react';
import { AnyCtor, CutsceneTrack, findAttachableClips, getMetadataFromCtor } from 'deer-engine';
import { TimelineActionClip } from './TimelineActionClip';
import { useScaleStore } from './store';
import { useBindSignal, useDumbState } from '@/hooks';
import { ContextListItem, ProContextMenu } from '@/assets/components';

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

  const clips = findAttachableClips(getMetadataFromCtor(object.constructor as AnyCtor).__classname__);

  const contextList: ContextListItem[] = clips.map((a) => {
    const metadata = getMetadataFromCtor(a);
    return {
      name: metadata.__classname__ || '<missing classname>',
      onSelect: () => {
        const start = offsetX / scale;
        const end = start + 2;
        object.addClip('Transform', { startTime: start, endTime: end });
      },
    };
  });

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
