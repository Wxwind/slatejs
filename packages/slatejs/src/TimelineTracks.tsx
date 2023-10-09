import { FC } from 'react';

interface TimelineTracksProps {
  width: number;
}

const TimelineTracks: FC<TimelineTracksProps> = (props) => {
  const { width } = props;
  return (
    <div className="timeline-tracks" style={{ width: `${width}px` }}>
      TimelineTracks
    </div>
  );
};

export default TimelineTracks;
