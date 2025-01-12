import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import Phaser from "phaser";
import Group = Phaser.Physics.Arcade.Group;
import GameObject = Phaser.GameObjects.GameObject;

interface Target extends GameObject {
  x: number;
  y: number;
  isToBeKilled?: boolean;
}

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
    // todo: maybe change hero to owner in future and pass reference
    return this._scene.hero;
  }

  get targets() {
    return this._targets;
  }

  get nearestTarget() {
    let nearestEnemy: Target | null = null;
    let minDistance = Number.MAX_VALUE;

    const targets = this.targets
      .getChildren()
      .filter((target: GameObject) => !(target as Target).isToBeKilled);

    targets.forEach((gameObject: GameObject) => {
      const target = gameObject as Target;
      const distance = Phaser.Math.Distance.Between(
        this.hero.x,
        this.hero.y,
        target.x,
        target.y,
      );
      if (distance < minDistance) {
        nearestEnemy = target;
        minDistance = distance;
      }
    });

    return nearestEnemy;
  }

  abstract activate(): void;
  abstract update(): void;
}

export default AbstractSkill;
