import { FC } from 'react';
import Controls from './Controls';
import Timeline from './Timeline';
import { CutScene } from './CutScene';

export interface TimelineEditorProps {
  scene: CutScene;
}

const TimelineEditor: FC<TimelineEditorProps> = (props) => {
  const { scene } = props;
  return (
    <div style={{ width: '100%', height: '320px' }}>
      <Controls />
      aa
      <Timeline scene={scene} />
    </div>
  );
};

export default TimelineEditor;
