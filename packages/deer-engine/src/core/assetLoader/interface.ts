import { Group, Object3DEventMap, Texture } from 'three';

export interface IModelLoader {
  loadModelAsync: (
    address: string,
    onProgress?: (event: ProgressEvent) => void
  ) => Promise<Group<Object3DEventMap> | undefined>;
}

export interface ITextureLoader {
  loadTextureAsync: (address: string, onProgress?: (event: ProgressEvent) => void) => Promise<Texture | undefined>;
}

export interface IAssetLoader {
  loadModelAsync: (
    address: string,
    onProgress?: (event: ProgressEvent) => void
  ) => Promise<Group<Object3DEventMap> | undefined>;
  loadTextureAsync: (address: string, onProgress?: (event: ProgressEvent) => void) => Promise<Texture | undefined>;
}
