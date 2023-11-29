import { FC, useCallback } from 'react';
import { useStore } from './hooks/useStore';
import { AnimationClip, TrackData } from './core';
import { TimelineActionClip } from './TimelineActionClip';
import { Cutscene } from './core';

interface TimelineTracksProps {
  width: number;
  cutscene: Cutscene;
  data: TrackData;
}

const TimelineTracksPanel: FC<TimelineTracksProps> = (props) => {
  const { width, cutscene, data } = props;
  const cutsceneData = useStore(cutscene.cutsceneDataStore);
  const { scale } = cutscene.useScaleStore();

  const handleRightlick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      const start = e.nativeEvent.offsetX / scale;
      const end = start + 2;
      const layer = Math.floor(e.nativeEvent.offsetY / 32);

      // TODO
      // const anim = AnimationClip.construct('animation', start, end, layer, '123');
      // cutscene.cutsceneDataStore.addClip(anim);
    },
    [scale]
  );

  return (
    <div style={{ width: `${width}px` }}>
      <div className="timeline-track-panel" onContextMenu={handleRightlick}></div>
      {data.children.map((a) => (
        <TimelineActionClip key={a.id} data={a} cutscene={cutscene} />
      ))}
    </div>
  );
};

export default TimelineTracksPanel;
