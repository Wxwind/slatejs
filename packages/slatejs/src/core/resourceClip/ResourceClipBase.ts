export abstract class ResourceClipBase {
  abstract id: string;
  abstract serialize(): Record<string, unknown>;
}
