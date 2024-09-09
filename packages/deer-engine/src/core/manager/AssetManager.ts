import { isNil } from '@/util';
import { AssetLoader, IAssetLoader } from '../assetLoader';
import { FileManager } from './FileManager/FileManager';
import { IAssetManager } from './interface';
import { AbstractManager } from '../interface';

export class AssetManager extends AbstractManager implements IAssetManager {
  private readonly assetLoader: IAssetLoader = new AssetLoader();

  init(): void {}

  uploadFileAsync = async (name: string, file: Blob) => {
    const fileManager = this.engine.getManager(FileManager);
    return fileManager.uploadAsset(name, file);
  };

  loadModelAsync = async (address: string, onProgress?: (event: ProgressEvent) => void) => {
    const fileManager = this.engine.getManager(FileManager);
    const builtinURL = fileManager.getBuiltinFile(address);
    if (!isNil(builtinURL)) {
      const asset = await this.assetLoader.loadModelAsync(builtinURL, onProgress);
      return asset;
    }

    const assetFile = await fileManager.getAsset(address);
    if (isNil(assetFile)) {
      throw new Error(`cannot find model of uuid '${address}'`);
    }
    const url = URL.createObjectURL(assetFile.asset);
    const asset = await this.assetLoader.loadModelAsync(url, onProgress);
    URL.revokeObjectURL(url);
    return asset;
  };

  loadTextureAsync = async (address: string, onProgress?: (event: ProgressEvent) => void) => {
    const fileManager = this.engine.getManager(FileManager);
    const builtinURL = fileManager.getBuiltinFile(address);
    if (!isNil(builtinURL)) {
      const asset = await this.assetLoader.loadTextureAsync(builtinURL, onProgress);
      return asset;
    }

    const assetFile = await fileManager.getAsset(address);
    if (isNil(assetFile)) {
      throw new Error(`cannot find texture of uuid '${address}'`);
    }
    const url = URL.createObjectURL(assetFile.asset);
    const asset = await this.assetLoader.loadTextureAsync(url, onProgress);
    URL.revokeObjectURL(url);
    return asset;
  };

  destroy(): void {}
}
