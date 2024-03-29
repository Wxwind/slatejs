import { DisplayObject } from '../DisplayObject';

export interface Sortable {
  dirty: boolean;

  renderOrder: number; // zIndex
  sorted: DisplayObject[] | undefined;
}
