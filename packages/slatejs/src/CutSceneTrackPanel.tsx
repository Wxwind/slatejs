import { FC } from 'react';
import { CutScene } from '.';

interface CutSceneTrackPanelProps {
  cutScene: CutScene;
}

export const CutSceneTrackPanel: FC<CutSceneTrackPanelProps> = (props) => {
  const { cutScene } = props;
  return <div>CutSceneTrackPanel</div>;
};
