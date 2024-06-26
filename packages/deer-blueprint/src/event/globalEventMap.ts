export enum ContextMenuType {
  CREATE_NODE,
  Node,
  Pin,
}

export interface GlobalEventMap {
  contextmenu: (type: ContextMenuType, context: any) => void;
}
