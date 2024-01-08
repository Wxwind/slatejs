import { MeshComponent } from 'deer-engine';
import { FC } from 'react';

interface MeshCompProps {
  comp: MeshComponent;
}

export const MeshComp: FC<MeshCompProps> = (props) => {
  const { comp } = props;

  return <div>MeshComp</div>;
};
