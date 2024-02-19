export interface IAnimatable {
  get isValid(): boolean;
  hasAnyKey: () => boolean;
  tryAddKey: (time: number) => boolean;
  removeKey: (time: number) => void;

  evaluate: (curTime: number, prevTime: number) => void;

  saveSnapshot: () => void;
  restoreSnapshot: () => void;
}
