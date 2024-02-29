export interface IRenderer {
  resize: (width: number, height: number) => void;
  dispose: () => void;
}
