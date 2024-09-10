import { Group, Object3DEventMap, Texture } from 'three';

export interface IModelLoader {
  loadAsync: (
    address: string,
    onProgress?: (event: ProgressEvent) => void
  ) => Promise<Group<Object3DEventMap> | undefined>;
}

export interface ITextureLoader {
  loadAsync: (address: string, onProgress?: (event: ProgressEvent) => void) => Promise<Texture | undefined>;
}
