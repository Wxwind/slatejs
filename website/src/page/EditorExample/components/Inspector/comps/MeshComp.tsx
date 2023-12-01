import { MeshCompJson } from 'deer-engine';
import { FC } from 'react';

interface MeshCompProps {
  entityId: string;
  compId: string;
  config: MeshCompJson;
}

export const MeshComp: FC<MeshCompProps> = (props) => {
  const { config } = props;

  return <div>MeshComp</div>;
};
