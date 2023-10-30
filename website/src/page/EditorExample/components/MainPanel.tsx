import { FC } from 'react';
import { Hierarchy } from './Hierarchy';
import { Inspector } from './Inspector';

interface MainPanelProps {}

export const MainPanel: FC<MainPanelProps> = (props) => {
  const {} = props;
  return (
    <div className="flex flex-col bg-gray-400 h-full">
      <Hierarchy />
      <Inspector />
    </div>
  );
};
