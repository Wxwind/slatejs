// TODO expire time
export class Blackboard {
  _map = new Map<string, any>();

  setValue(key: string, value: any) {
    this._map.set(key, value);
  }

  getValue<T>(key: string): T {
    return this._map.get(key) as T;
  }

  removeValue(key: string) {
    return this._map.delete(key);
  }

  clear() {
    this._map.clear();
  }
}
