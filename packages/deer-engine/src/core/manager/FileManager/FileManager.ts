import { AssetFile } from './interface';

const DBNAME = 'DeerEngine';
const SHEETNAME = 'DeerScene';

export class FileManager {
  private _instance: FileManager | undefined;
  public get Instance(): FileManager {
    if (this._instance === undefined) {
      this._instance = new FileManager();
      return this._instance;
    }
    return this._instance;
  }

  private db: IDBDatabase | undefined;

  awake = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DBNAME);

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
        const objectStore = db.createObjectStore(SHEETNAME, {
          keyPath: 'uuid',
        });
        objectStore.createIndex('uuid', 'uuid', { unique: true });
        objectStore.createIndex('name', 'name', { unique: true });
      };
    });
  };

  getAsset: (uuid: string) => Promise<AssetFile> = (uuid: string) => {
    return new Promise((resolve, reject) => {
      if (!this.db) return;
      const transaction = this.db.transaction(SHEETNAME, 'readonly');
      const objStore = transaction.objectStore(SHEETNAME);
      const request = objStore.get(uuid);
      request.onsuccess = (event) => {
        console.log('indexdb: get asset success');
        resolve(request.result as AssetFile);
      };
      request.onerror = (event) => {
        console.error('indexdb: get asset failed');
      };
    });
  };

  saveAsset = (asset: AssetFile) => {
    if (!this.db) return;
    const transaction = this.db.transaction(SHEETNAME, 'readwrite');
    const objStore = transaction.objectStore(SHEETNAME);
    const request = objStore.add(asset);
    request.onsuccess = (event) => {
      console.log('indexdb: save asset success');
    };
    request.onerror = (event) => {
      console.error('indexdb: save asset failed');
    };
  };
}
