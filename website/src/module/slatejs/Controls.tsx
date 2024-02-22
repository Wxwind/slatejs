import { FC } from 'react';
import classnames from 'classnames';
import { CutsceneEditor } from 'deer-engine';
import { RxPlay, RxStop, RxTrackNext, RxTrackPrevious } from 'react-icons/rx';

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
          <RxTrackPrevious
            onClick={() => {
              cutsceneEditor.setTime(cutsceneEditor.cutscene.currentTime - 1);
            }}
          />
        </div>
        <div className="controls-btn">
          <RxPlay
            className="rotate-180"
            onClick={() => {
              cutsceneEditor.playReverse();
            }}
          />
        </div>
        <div className="controls-btn">
          <RxStop
            onClick={() => {
              cutsceneEditor.stop();
            }}
          />
        </div>
        <div className="controls-btn">
          <RxPlay
            onClick={() => {
              cutsceneEditor.play();
            }}
          />
        </div>
        <div className="controls-btn">
          <RxTrackNext
            onClick={() => {
              cutsceneEditor.setTime(cutsceneEditor.cutscene.currentTime + 1);
            }}
          />
        </div>
      </div>
    </div>
  );
};
