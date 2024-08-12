import { Group, Object3DEventMap, Texture } from 'three';

export interface IModelLoader {
  loadModelAsync: (
    assetName: string,
    onProgress?: (event: ProgressEvent) => void
  ) => Promise<Group<Object3DEventMap> | undefined>;
}

export interface ITextureLoader {
  loadTextureAsync: (assetName: string, onProgress?: (event: ProgressEvent) => void) => Promise<Texture | undefined>;
}

export interface IAssetLoader {
  loadModelAsync: (
    assetName: string,
    onProgress?: (event: ProgressEvent) => void
  ) => Promise<Group<Object3DEventMap> | undefined>;
  loadTextureAsync: (assetName: string, onProgress?: (event: ProgressEvent) => void) => Promise<Texture | undefined>;
}
