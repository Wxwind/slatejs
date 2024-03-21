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
    <div className={classnames('relative h-8 bg-[#333] w-full text-gray-300 controls', className)}>
      <div className="h-full flex items-center gap-x-1">
        <div className="cursor-pointer hover:text-white">
          <RxTrackPrevious
            onClick={() => {
              cutsceneEditor.setTime(cutsceneEditor.cutscene.currentTime - 1);
            }}
          />
        </div>
        <div className="cursor-pointer hover:text-white">
          <RxPlay
            className="rotate-180"
            onClick={() => {
              cutsceneEditor.playReverse();
            }}
          />
        </div>
        <div className="cursor-pointer hover:text-white">
          <RxStop
            onClick={() => {
              cutsceneEditor.stop();
            }}
          />
        </div>
        <div className="cursor-pointer hover:text-white">
          <RxPlay
            onClick={() => {
              cutsceneEditor.play();
            }}
          />
        </div>
        <div className="cursor-pointer hover:text-white">
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
