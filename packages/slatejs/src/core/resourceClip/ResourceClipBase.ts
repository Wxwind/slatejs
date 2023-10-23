export type ResourceJson = {
  start: number;
  end: number;
  id: string;
  layerId: number;
  name: string;
};

export abstract class ResourceClipBase {
  abstract data: ResourceJson;

  abstract serialize(): Record<string, unknown>;
}
