import { FC } from 'react';
import { ResourceClipBase } from './core/resourceClip';

interface TrackBlockProps {
  resourceClip: ResourceClipBase;
}

const TrackBlock: FC<TrackBlockProps> = (props) => {
  const { resourceClip } = props;
  return <div className="track-block">TrackBlock</div>;
};

export default TrackBlock;
