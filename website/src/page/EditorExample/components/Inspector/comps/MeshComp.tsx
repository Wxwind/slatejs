import { MeshCompJson } from 'deer-engine';
import { FC } from 'react';

interface MeshCompProps {
  config: MeshCompJson;
}

export const MeshComp: FC<MeshCompProps> = (props) => {
  const {} = props;

  return <div>MeshComp</div>;
};
