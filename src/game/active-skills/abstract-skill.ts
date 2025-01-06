import Hero from "../game-objects/Hero.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import Group = Phaser.Physics.Arcade.Group;

abstract class AbstractSkill {
  private readonly _scene: AbstractGameplayScene;
  private readonly _targets: Phaser.Physics.Arcade.Group;
  constructor(scene: AbstractGameplayScene, targets: Group) {
    this._scene = scene;
    this._targets = targets;
  }

  get scene() {
    return this._scene;
  }

  get hero() {
    return this._scene.hero;
  }

  get targets() {
    return this._targets;
  }

  abstract activate(hero: Hero, targets: Group): void;
  abstract update(): void;
}

export default AbstractSkill;
