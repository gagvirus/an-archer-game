import Barrage from "./Barrage.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import { ProjectileType } from "../game-objects/AbstractProjectile.ts";
import Group = Phaser.Physics.Arcade.Group;

class ArrowBarrage extends Barrage {
  constructor(scene: AbstractGameplayScene, targets: Group) {
    super(scene, targets, ProjectileType.arrow, 0.2);
  }
}

export default ArrowBarrage;
