import { FC } from 'react';

interface TimelineTracksProps {
  width: number;
}

const TimelineTracksPanel: FC<TimelineTracksProps> = (props) => {
  const { width } = props;
  return (
    <div className="timeline-tracks-panel" style={{ width: `${width}px` }}>
      TimelineTracks
    </div>
  );
};

export default TimelineTracksPanel;
