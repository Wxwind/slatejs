import { FC } from 'react';
import { CutScene } from './core';

interface TrackBlockProps {
  cutScene: CutScene;
}

const TrackBlock: FC<TrackBlockProps> = (props) => {
  const { cutScene } = props;
  return <div>TrackBlock</div>;
};

export default TrackBlock;
