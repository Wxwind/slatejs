import { useEngineStore } from '@/hooks';
import { DeerEngine } from 'deer-engine';
import { FC } from 'react';

interface HierarchyProps {
  className?: string;
}

export const Hierarchy: FC<HierarchyProps> = (props) => {
  const { className } = props;
  // FIXME
  const {} = useEngineStore(DeerEngine.instance.activeScene?.entityStore);

  return <div className={className}>Hierarchy</div>;
};
