export interface ISerializable<TData = unknown> {
  serialize: () => TData;
  deserialize: (data: TData) => void;
}
