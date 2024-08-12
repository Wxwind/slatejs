import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { getFileNameAndExt, getFileNameFromUrl } from '@/util';
import { IModelLoader } from './interface';

export class ModelLoader implements IModelLoader {
  private readonly gltfLoader = new GLTFLoader();
  private readonly fbxLoader = new FBXLoader();

  loadModelAsync = async (url: string, onProgress?: (event: ProgressEvent) => void) => {
    const assetName = getFileNameFromUrl(url);
    const { ext } = getFileNameAndExt(assetName);
    switch (ext.toLowerCase()) {
      case 'gltf':
      case 'glb': {
        return this.loadGLTFAsync(url, onProgress);
      }
      case 'fbx':
        return this.loadFBXAsync(url, onProgress);
      default:
        throw new Error(`ModelLoder cannot load ".${ext}" file`);
    }
  };

  private loadGLTFAsync = async (url: string, onProgress?: (event: ProgressEvent) => void) => {
    const gltf = await this.gltfLoader.loadAsync(url, onProgress);
    return gltf.scene;
  };

  private loadFBXAsync = async (url: string, onProgress?: (event: ProgressEvent) => void) => {
    const geometry = await this.fbxLoader.loadAsync(url, onProgress);
    return geometry;
  };
}
