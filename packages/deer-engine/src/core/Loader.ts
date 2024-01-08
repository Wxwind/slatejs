import { FileLoader, EquirectangularReflectionMapping } from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export class Loader {
  private readonly rgbeLoader: RGBELoader = new RGBELoader();
  private readonly fileLoader: FileLoader = new FileLoader();

  loadTexture = async (url: string) => {
    const t = this.loadRGBETexture(url);
    return t;
  };

  private loadRGBETexture = async (hdrUrl: string) => {
    const texture = await this.rgbeLoader.loadAsync(hdrUrl);
    texture.mapping = EquirectangularReflectionMapping;
    return texture;
  };
}
