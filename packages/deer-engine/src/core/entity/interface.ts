export interface IBehaviour {
  awake: () => void;
  update: (dt: number) => void;
  destroy: () => void;
}
