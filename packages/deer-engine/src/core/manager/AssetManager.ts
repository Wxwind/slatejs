import { isNil } from 'lodash';
import { AssetLoader, IAssetLoader } from '../assetLoader';
import { FileManager } from './FileManager/FileManager';
import { IAssetManager } from './interface';

export class AssetManager implements IAssetManager {
  private readonly assetLoader: IAssetLoader = new AssetLoader();
  private fileManager: FileManager | undefined;

  setFileManager(fileManager: FileManager) {
    this.fileManager = fileManager;
  }

  loadModelAsync = async (address: string, onProgress?: (event: ProgressEvent) => void) => {
    if (this.fileManager === undefined) throw new Error('fileManager is invalid');
    const builtinURL = this.fileManager.getBuiltinFile(address);
    if (!isNil(builtinURL)) {
      const asset = await this.assetLoader.loadModelAsync(builtinURL, onProgress);
      return asset;
    }

    const assetFile = await this.fileManager.getAsset(address);
    if (isNil(assetFile)) {
      throw new Error(`cannot find model of uuid '${address}'`);
    }
    const url = URL.createObjectURL(assetFile.asset);
    const asset = await this.assetLoader.loadModelAsync(url, onProgress);
    URL.revokeObjectURL(url);
    return asset;
  };

  loadTextureAsync = async (address: string, onProgress?: (event: ProgressEvent) => void) => {
    if (this.fileManager === undefined) throw new Error('fileManager is invalid');
    const builtinURL = this.fileManager.getBuiltinFile(address);
    if (!isNil(builtinURL)) {
      const asset = await this.assetLoader.loadTextureAsync(builtinURL, onProgress);
      return asset;
    }

    const assetFile = await this.fileManager.getAsset(address);
    if (isNil(assetFile)) {
      throw new Error(`cannot find texture of uuid '${address}'`);
    }
    const url = URL.createObjectURL(assetFile.asset);
    const asset = await this.assetLoader.loadTextureAsync(url, onProgress);
    URL.revokeObjectURL(url);
    return asset;
  };
}
