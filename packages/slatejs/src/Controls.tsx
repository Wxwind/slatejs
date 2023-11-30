import { FC } from 'react';
import classnames from 'classnames';
import { Cutscene } from './core';
import { PlayIcon, StopIcon, TrackNextIcon, TrackPreviousIcon } from '@radix-ui/react-icons';

export interface ControlsProps {
  className?: string;
  cutscene: Cutscene;
}

export const Controls: FC<ControlsProps> = (props) => {
  const { className, cutscene } = props;
  return (
    <div className={classnames('controls', className)}>
      <div className="controls-btn-line">
        <div className="controls-btn">
          <TrackPreviousIcon
            onClick={() => {
              cutscene.setTime(cutscene.director.currentTime - 1);
            }}
          />
        </div>
        <div className="controls-btn">
          <PlayIcon
            className="rotate-180"
            onClick={() => {
              cutscene.playReverse();
            }}
          />
        </div>
        <div className="controls-btn">
          <StopIcon
            onClick={() => {
              cutscene.stop();
            }}
          />
        </div>
        <div className="controls-btn">
          <PlayIcon
            onClick={() => {
              cutscene.play();
            }}
          />
        </div>
        <div className="controls-btn">
          <TrackNextIcon
            onClick={() => {
              cutscene.setTime(cutscene.director.currentTime + 1);
            }}
          />
        </div>
      </div>
    </div>
  );
};
