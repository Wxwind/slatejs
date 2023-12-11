export interface IAnimatable {
  hasAnyKey: () => boolean;
  tryAddKey: (time: number) => boolean;
  removeKey: (time: number) => void;

  evaluate: (curTime: number, prevTime: number) => void;
}
