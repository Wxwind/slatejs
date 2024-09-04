export interface IBehaviour {
  awake(): void;
  onEnabled(): void;
  onDisabled(): void;
  update(dt: number): void;
  destroy(): void;
}
