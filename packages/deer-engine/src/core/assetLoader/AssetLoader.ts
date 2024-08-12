import { ModelLoader } from './ModelLoader';
import { TextureLoader } from './TextureLoader';
import { IAssetLoader, IModelLoader, ITextureLoader } from './interface';

export class AssetLoader implements IAssetLoader {
  private readonly modelLoader: IModelLoader = new ModelLoader();
  private readonly textureLoader: ITextureLoader = new TextureLoader();

  loadModelAsync = (id: string, onProgress?: (event: ProgressEvent) => void) => {
    return this.modelLoader.loadModelAsync(id, onProgress);
  };

  loadTextureAsync = (id: string, onProgress?: (event: ProgressEvent) => void) => {
    return this.textureLoader.loadTextureAsync(id, onProgress);
  };
}
