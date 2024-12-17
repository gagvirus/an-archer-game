export interface ISceneLifecycle {
  preload?(): void;

  init?(data: unknown): void;

  create?(): void;

  update?(time: number, delta: number): void;
}
