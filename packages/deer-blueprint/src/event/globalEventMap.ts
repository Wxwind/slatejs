import Konva from 'konva';

export enum ContextMenuType {
  CREATE_NODE,
  Node,
  Pin,
}

export type ContextMenuContext = { position: Konva.Vector2d };

export interface GlobalEventMap {
  contextmenu: (type: ContextMenuType, context: ContextMenuContext) => void;
  stageMove: (posiition: Konva.Vector2d) => void;
  stageClick: (posiition: Konva.Vector2d) => void;
}
