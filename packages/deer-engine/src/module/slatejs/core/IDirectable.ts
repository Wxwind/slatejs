import { MathUtils } from '@/math';
import { Cutscene } from './Cutscene';
import { Entity } from '@/core';

export interface IDirectable {
  get root(): Cutscene | null;
  get parent(): IDirectable | null;
  get children(): IDirectable[];

  get startTime(): number;
  get endTime(): number;

  get isActive(): boolean;
  get id(): string;
  get name(): string;
  get actor(): Entity | undefined;

  initialize: () => boolean;

  enter: () => void;

  update: (curTime: number, prevtime: number) => void;

  exit: () => void;

  /**
   * timePointer to trigger onEnter is the same to trigger onReverseEnter
   * (different play direction)
   */
  reverseEnter: () => void;

  /**
   * timePointer to trigger onExit is the same to trigger onReverseExit
   * (different play direction)
   */
  reverseExit: () => void;
}

export const IDirectableToLocalTime = (directable: IDirectable, time: number) => {
  return MathUtils.clamp(time - directable.startTime, 0, directable.endTime - directable.startTime);
};

export const IDirectableGetLength = (directable: IDirectable) => {
  return directable.endTime - directable.startTime;
};
