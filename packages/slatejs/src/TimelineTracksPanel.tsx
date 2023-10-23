import { FC, useCallback } from 'react';
import { useStore } from './hooks/useStore';
import { AnimationClip } from './core/resourceClip';
import TrackBlock from './TrackBlock';
import { CutScene } from './core';

interface TimelineTracksProps {
  width: number;
  cutScene: CutScene;
}

const TimelineTracksPanel: FC<TimelineTracksProps> = (props) => {
  const { width, cutScene } = props;
  const resourceJSONs = useStore(cutScene.resourcesStore);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const start = e.nativeEvent.offsetX / 32;
      const end = start + 2;
      const layer = Math.floor(e.nativeEvent.offsetY / 32);

      const anim = AnimationClip.construct('animation', start, end, layer);
      console.log(anim);
      cutScene.resourcesStore.addAnimation(anim);
    },
    [cutScene]
  );

  return (
    <div className="timeline-tracks-panel" style={{ width: `${width}px` }} onDoubleClick={handleDoubleClick}>
      {(resourceJSONs || []).map((a) => (
        <TrackBlock key={a.id} resourceJSON={a} cutScene={cutScene} />
      ))}
    </div>
  );
};

export default TimelineTracksPanel;
