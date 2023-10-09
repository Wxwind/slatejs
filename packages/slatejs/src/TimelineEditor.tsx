import { FC, useEffect } from 'react';
import Controls from './Controls';
import Timeline from './Timeline';
import { CutScene } from './core';

export interface TimelineEditorProps {
  cutScene: CutScene;
}

const TimelineEditor: FC<TimelineEditorProps> = (props) => {
  const { cutScene } = props;

  useEffect(() => {
    window.addEventListener('resize', cutScene.signals.windowResized.emit);
    cutScene.signals.windowResized.emit();
    return () => {
      window.removeEventListener('resize', cutScene.signals.windowResized.emit);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '320px', position: 'absolute' }}>
      {/* <Controls /> */}
      <Timeline cutScene={cutScene} />
    </div>
  );
};

export default TimelineEditor;
