import { FC } from 'react';
import { useStore } from './hooks/useStore';
import { ResourceClipBase } from './core/resourceClip';
import TrackBlock from './TrackBlock';

interface TimelineTracksProps {
  width: number;
  resourceClips: ResourceClipBase[];
}

const TimelineTracksPanel: FC<TimelineTracksProps> = (props) => {
  const { width, resourceClips } = props;

  return (
    <div className="timeline-tracks-panel" style={{ width: `${width}px` }}>
      {resourceClips.map((a) => (
        <TrackBlock key={a.id} resourceClip={a} />
      ))}
    </div>
  );
};

export default TimelineTracksPanel;
