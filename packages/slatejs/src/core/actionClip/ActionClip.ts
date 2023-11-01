export type ActionClipJson = {
  start: number;
  end: number;
  id: string;
  layerId: number;
  name: string;
};

export abstract class ActionClip {
  abstract data: ActionClipJson;

  abstract onUpdate: (time: number) => void;

  abstract serialize(): Record<string, unknown>;
}
