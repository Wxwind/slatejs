import { Texture, TextureLoader as THREETextureLoader } from 'three';
import { ITextureLoader } from './interface';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EquirectangularReflectionMapping } from 'three';
import { getFileNameFromUrl, getFileNameAndExt } from '@/util';

export class TextureLoader implements ITextureLoader {
  // load HDR
  private readonly rgbeLoader: RGBELoader = new RGBELoader();
  private readonly textureLoader: THREETextureLoader = new THREETextureLoader();

  loadTextureAsync: (
    assetName: string,
    onProgress?: (event: ProgressEvent<EventTarget>) => void
  ) => Promise<Texture | undefined> = async (url, onProgress) => {
    const assetName = getFileNameFromUrl(url);
    const { ext } = getFileNameAndExt(assetName);
    switch (ext.toLowerCase()) {
      case 'png':
      case 'gif':
      case 'jpeg':
      case 'jpg': {
        return this.loadTextureAsyncInternal(url, onProgress);
      }
      case 'hdr':
        return this.loadHDRAsync(url, onProgress);
      default:
        throw new Error(`ModelLoder cannot load ".${ext}" file`);
    }
  };

  private loadTextureAsyncInternal = async (url: string, onProgress?: (event: ProgressEvent<EventTarget>) => void) => {
    const texture = await this.textureLoader.loadAsync(url, onProgress);
    return texture;
  };

  private loadHDRAsync = async (url: string, onProgress?: (event: ProgressEvent<EventTarget>) => void) => {
    const texture = await this.rgbeLoader.loadAsync(url, onProgress);
    texture.mapping = EquirectangularReflectionMapping;
    return texture;
  };
}
