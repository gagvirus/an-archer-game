import Group = Phaser.GameObjects.Group;
import GameObject = Phaser.GameObjects.GameObject;
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import Enemy from "../game-objects/Enemy.ts";

export class EnemyGroup extends Group {
  constructor(scene: AbstractGameplayScene) {
    super(scene);
    this._gamePlayScene = scene;
  }

  private _gamePlayScene: AbstractGameplayScene;

  get gamePlayScene(): AbstractGameplayScene {
    return this._gamePlayScene;
  }

  // Override add to enforce type safety
  add(child: Enemy, addToScene?: boolean): this {
    if (!(child instanceof Enemy)) {
      throw new Error("Only Enemy instances can be added to this group.");
    }
    return super.add(child, addToScene);
  }

  // Type-safe iteration
  forEach(callback: (enemy: Enemy) => void): void {
    this.children.iterate((child: GameObject) => {
      if (child instanceof Enemy) {
        callback(child);
      }
      return true;
    });
  }
}
