import { FC } from 'react';
import { TimelineInspector } from './TimelineInspector';

interface InspectorProps {
  className?: string;
}

export const Inspector: FC<InspectorProps> = (props) => {
  const { className } = props;

  return (
    <div className={className}>
      <TimelineInspector />
    </div>
  );
};
