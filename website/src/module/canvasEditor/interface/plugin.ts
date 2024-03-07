import { CanvasContext } from './canvas';

export interface IPlugin {
  apply(context: CanvasContext): void;
}
