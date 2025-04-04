import { Timeline } from './components';
import { FC } from 'react';
import { SceneCanvas, MainPanel, Header } from './components';
import { useGetActiveScene } from '@/api';

export const EditorExample: FC = () => {
  const scene = useGetActiveScene();
  return (
    <div className="w-screen h-screen relative flex flex-col">
      <div className="grow-0">
        <Header scene={scene} />
      </div>
      <div className="flex grow">
        <div className="w-3/4 h-full relative">
          <SceneCanvas />
          <Timeline />
        </div>
        <div className="w-1/4 h-full">
          <MainPanel scene={scene} />
        </div>
      </div>
    </div>
  );
};
