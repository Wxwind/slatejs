import { FC } from 'react';
import { TimelineInspector } from './TimelineInspector';
import * as Tabs from '@radix-ui/react-tabs';
import { EntityInspector } from './EntityInspector';
import { DeerScene } from 'deer-engine';

interface InspectorProps {
  className?: string;
  scene: DeerScene | undefined;
}

export const Inspector: FC<InspectorProps> = (props) => {
  const { className, scene } = props;

  return (
    <Tabs.Root className="flex flex-col" defaultValue="entity">
      <Tabs.List className="flex border-b border-gray-500 bg-gray-300">
        <Tabs.Trigger
          className="py-1 px-2 flex items-center justify-center select-none outline-none data-[state=active]:text-blue-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current"
          value="entity"
        >
          Entity
        </Tabs.Trigger>
        <Tabs.Trigger
          className="py-1 px-2 flex items-center justify-center select-none outline-none data-[state=active]:text-blue-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current"
          value="timeline"
        >
          Timeline
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="entity">
        <EntityInspector scene={scene} />
      </Tabs.Content>
      <Tabs.Content value="timeline">
        <TimelineInspector />
      </Tabs.Content>
    </Tabs.Root>
  );
};
