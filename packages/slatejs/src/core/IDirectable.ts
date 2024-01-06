import { CutsceneDirector } from './CutsceneDirector';
import { Entity, clamp } from 'deer-engine';

export interface IDirectable {
  get root(): CutsceneDirector | null;
  get parent(): IDirectable | null;
  get children(): IDirectable[];

  get startTime(): number;
  get endTime(): number;

  get isActive(): boolean;
  get id(): string;
  get name(): string;
  get actor(): Entity | undefined;

  onInitialize: () => boolean;

  onEnter: () => void;

  onUpdate: (curTime: number, prevtime: number) => void;

  onExit: () => void;

  /**
   * timePointer to trigger onEnter is the same to trigger onReverseEnter
   * (different play direction)
   */
  onReverseEnter: () => void;

  /**
   * timePointer to trigger onExit is the same to trigger onReverseExit
   * (different play direction)
   */
  onReverseExit: () => void;
}

export const IDirectableToLocalTime = (directable: IDirectable, time: number) => {
  return clamp(time - directable.startTime, 0, directable.endTime - directable.startTime);
};

export const IDirectableGetLengh = (directable: IDirectable) => {
  return directable.endTime - directable.startTime;
};
