import { AssetLoader, IAssetLoader } from '../../assetLoader';
import { FileManager } from '../FileManager/FileManager';
import { IAssetManager } from '../interface';

export class AssetManager implements IAssetManager {
  private readonly assetLoader: IAssetLoader = new AssetLoader();
  private fileManager: FileManager | undefined;

  setFileManager(fileManager: FileManager) {
    this.fileManager = fileManager;
  }

  loadModelAsync = async (uuid: string, onProgress?: (event: ProgressEvent) => void) => {
    if (this.fileManager === undefined) throw new Error('fileManager is invalid');
    const assetFile = await this.fileManager.getAsset(uuid);
    const url = URL.createObjectURL(assetFile.asset);
    const asset = await this.assetLoader.loadModelAsync(url, onProgress);
    URL.revokeObjectURL(url);
    return asset;
  };

  loadTextureAsync = async (uuid: string, onProgress?: (event: ProgressEvent) => void) => {
    if (this.fileManager === undefined) throw new Error('fileManager is invalid');
    const assetFile = await this.fileManager.getAsset(uuid);
    const url = URL.createObjectURL(assetFile.asset);
    const asset = await this.assetLoader.loadTextureAsync(url, onProgress);
    URL.revokeObjectURL(url);
    return asset;
  };
}
