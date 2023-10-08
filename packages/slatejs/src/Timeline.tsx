import { FC } from 'react';
import { CutScene } from './CutScene';

export interface TimelineProps {
  scene: CutScene;
}

const Timeline: FC<TimelineProps> = (props) => {
  const { scene } = props;
  return <div>Timeline</div>;
};

export default Timeline;
