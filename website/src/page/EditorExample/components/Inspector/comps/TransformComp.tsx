import { TransformCompJson } from 'deer-engine';
import { FC } from 'react';

interface TransformCompProps {
  config: TransformCompJson;
}

export const TransformComp: FC<TransformCompProps> = (props) => {
  const { config } = props;

  return <div>TransformComp</div>;
};
