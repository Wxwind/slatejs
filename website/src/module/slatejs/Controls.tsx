import { FC } from 'react';
import classnames from 'classnames';
import { CutsceneEditor } from 'deer-engine';
import { PlayIcon, StopIcon, TrackNextIcon, TrackPreviousIcon } from '@radix-ui/react-icons';

export interface ControlsProps {
  className?: string;
  cutsceneEditor: CutsceneEditor;
}

export const Controls: FC<ControlsProps> = (props) => {
  const { className, cutsceneEditor } = props;
  return (
    <div className={classnames('controls', className)}>
      <div className="controls-btn-line">
        <div className="controls-btn">
          <TrackPreviousIcon
            onClick={() => {
              cutsceneEditor.setTime(cutsceneEditor.cutscene.currentTime - 1);
            }}
          />
        </div>
        <div className="controls-btn">
          <PlayIcon
            className="rotate-180"
            onClick={() => {
              cutsceneEditor.playReverse();
            }}
          />
        </div>
        <div className="controls-btn">
          <StopIcon
            onClick={() => {
              cutsceneEditor.stop();
            }}
          />
        </div>
        <div className="controls-btn">
          <PlayIcon
            onClick={() => {
              cutsceneEditor.play();
            }}
          />
        </div>
        <div className="controls-btn">
          <TrackNextIcon
            onClick={() => {
              cutsceneEditor.setTime(cutsceneEditor.cutscene.currentTime + 1);
            }}
          />
        </div>
      </div>
    </div>
  );
};
