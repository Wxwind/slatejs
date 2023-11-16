import { FC } from 'react';
import { CutScene } from '.';

interface CutSceneGroupPanelProps {
  cutScene: CutScene;
}

export const CutSceneGroupPanel: FC<CutSceneGroupPanelProps> = (props) => {
  const { cutScene } = props;
  return <div>CusSceneGroup</div>;
};
