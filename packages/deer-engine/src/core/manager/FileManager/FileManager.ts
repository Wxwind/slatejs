import { genUUID } from '@/util';
import { AssetFile } from './interface';
import { AbstractManager } from '@/core/interface';

const DB_NAME = 'DeerEngine';
const SHEET_NAME = 'DeerScene';

export class FileManager extends AbstractManager {
  private db: IDBDatabase | undefined;

  private builtinAssetManifest: Record<string, string> = {};

  addBuiltinFile(manifest: Record<string, string>) {
    this.builtinAssetManifest = Object.assign({}, this.builtinAssetManifest, manifest);
  }

  getBuiltinFile(name: string): string | undefined {
    return this.builtinAssetManifest[name];
  }

  init = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME);

      request.onsuccess = (event) => {
        const db = request.result;
        this.db = db;
        console.log('open indexdb success');
        resolve(db);
      };

      request.onerror = function (event) {
        console.error('open indexdb failed');
      };

      request.onupgradeneeded = (event) => {
        console.log('onupgradeneeded');
        const db = request.result;
        this.db = db;
        // 创建存储库
        const objectStore = db.createObjectStore(SHEET_NAME, {
          keyPath: 'uuid',
        });
        objectStore.createIndex('uuid', 'uuid', { unique: true });
        objectStore.createIndex('name', 'name', { unique: true });
      };
    });
  };

  getAsset: (uuid: string) => Promise<AssetFile | undefined> = (uuid: string) => {
    return new Promise((resolve, reject) => {
      if (!this.db) return;
      const transaction = this.db.transaction(SHEET_NAME, 'readonly');
      const objStore = transaction.objectStore(SHEET_NAME);
      const request = objStore.get(uuid);
      request.onsuccess = (event) => {
        console.log('indexdb: get asset success');
        resolve(request.result as AssetFile | undefined);
      };
      request.onerror = (event) => {
        console.error('indexdb: get asset failed');
      };
    });
  };

  private saveAsset: (asset: AssetFile) => Promise<void> = (asset) => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('db is invalid');
        return;
      }
      const transaction = this.db.transaction(SHEET_NAME, 'readwrite');
      const objStore = transaction.objectStore(SHEET_NAME);
      const request = objStore.put(asset);
      request.onsuccess = (event) => {
        console.log('indexdb: save asset success');
        return;
      };
      request.onerror = (event) => {
        reject('indexdb: save asset failed');
      };
    });
  };

  uploadAsset = async (name: string, file: Blob) => {
    const assetFile: AssetFile = {
      uuid: genUUID(),
      name,
      asset: file,
    };
    await this.saveAsset(assetFile);
    return assetFile;
  };

  destroy(): void {}
}
