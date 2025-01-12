import Barrage from "./Barrage.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import { ProjectileType } from "../game-objects/AbstractProjectile.ts";
import Group = Phaser.Physics.Arcade.Group;

class FireBurst extends Barrage {
  constructor(scene: AbstractGameplayScene, targets: Group) {
    super(scene, targets, ProjectileType.fireball, 0.4, 12, 500, 200, 50);
  }
}

export default FireBurst;
