import { Timeline } from '@/components';
import { FC } from 'react';
import { SceneCanvas, MainPanel, Header } from './components';

export const EditorExample: FC = () => {
  return (
    <div className="w-screen h-screen relative flex flex-col">
      <div className="grow-0">
        <Header />
      </div>
      <div className="flex grow">
        <div className="w-3/4 h-full relative">
          <SceneCanvas />
          <Timeline />
        </div>
        <div className="w-1/4 h-full">
          <MainPanel />
        </div>
      </div>
    </div>
  );
};
