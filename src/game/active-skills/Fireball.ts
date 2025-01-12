import SingleShotProjectile from "./SingleShotProjectile.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import { ProjectileType } from "../game-objects/AbstractProjectile.ts";
import Group = Phaser.Physics.Arcade.Group;

class Fireball extends SingleShotProjectile {
  constructor(scene: AbstractGameplayScene, targets: Group) {
    super(scene, targets, ProjectileType.fireball);
  }
  protected get damageMultiplier(): number {
    return 2;
  }
}

export default Fireball;
