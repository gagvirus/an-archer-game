import SingleShotProjectile from "./SingleShotProjectile.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import { ProjectileType } from "../game-objects/AbstractProjectile.ts";
import Group = Phaser.Physics.Arcade.Group;

class SingleShotArrow extends SingleShotProjectile {
  constructor(scene: AbstractGameplayScene, targets: Group) {
    super(scene, targets, ProjectileType.arrow);
  }

  protected get damageMultiplier(): number {
    return 1;
  }
}

export default SingleShotArrow;
