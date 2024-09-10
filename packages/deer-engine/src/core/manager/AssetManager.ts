import { isNil } from '@/util';
import { IModelLoader, ITextureLoader, TextureLoader } from '../loader';
import { FileManager } from './FileManager/FileManager';
import { AbstractManager } from '../interface';
import { ModelLoader } from '../loader/ModelLoader';

export class ResourceManager extends AbstractManager {
  private readonly modelLoader: IModelLoader = new ModelLoader();
  private readonly textureLoader: ITextureLoader = new TextureLoader();

  init(): void {}

  uploadFileAsync = async (name: string, file: Blob) => {
    const fileManager = this.engine.getManager(FileManager);
    return fileManager.uploadAsset(name, file);
  };

  loadModelAsync = async (address: string, onProgress?: (event: ProgressEvent) => void) => {
    const fileManager = this.engine.getManager(FileManager);
    const builtinURL = fileManager.getBuiltinFile(address);
    if (!isNil(builtinURL)) {
      const asset = await this.modelLoader.loadAsync(builtinURL, onProgress);
      return asset;
    }

    const assetFile = await fileManager.getAsset(address);
    if (isNil(assetFile)) {
      throw new Error(`cannot find model of uuid '${address}'`);
    }
    const url = URL.createObjectURL(assetFile.asset);
    const asset = await this.modelLoader.loadAsync(url, onProgress);
    URL.revokeObjectURL(url);
    return asset;
  };

  loadTextureAsync = async (address: string, onProgress?: (event: ProgressEvent) => void) => {
    const fileManager = this.engine.getManager(FileManager);
    const builtinURL = fileManager.getBuiltinFile(address);
    if (!isNil(builtinURL)) {
      const asset = await this.textureLoader.loadAsync(builtinURL, onProgress);
      return asset;
    }

    const assetFile = await fileManager.getAsset(address);
    if (isNil(assetFile)) {
      throw new Error(`cannot find texture of uuid '${address}'`);
    }
    const url = URL.createObjectURL(assetFile.asset);
    const asset = await this.textureLoader.loadAsync(url, onProgress);
    URL.revokeObjectURL(url);
    return asset;
  };

  destroy(): void {}
}
