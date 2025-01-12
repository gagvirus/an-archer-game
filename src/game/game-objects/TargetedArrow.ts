import Phaser from "phaser";
import { Attackable } from "../helpers/gameplayer-helper.ts";
import AbstractProjectile, { ProjectileType } from "./AbstractProjectile.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;

export class TargetedArrow extends AbstractProjectile {
  target: Attackable;
  targetPosition: Vector2Like;

  constructor(
    scene: AbstractGameplayScene,
    x: number,
    y: number,
    targetPosition: Vector2Like,
    target: Attackable,
    speed: number = 500,
    owner: Attackable,
    attackDamage: number,
    isCritical: boolean,
  ) {
    super(
      scene,
      x,
      y,
      ProjectileType.arrow,
      attackDamage,
      isCritical,
      owner,
      speed,
      10,
    );
    this.target = target;
    this.targetPosition = targetPosition;

    this.faceTarget(targetPosition);
  }

  // Check if the arrow reached the target
  update() {
    this.moveTowardsTarget(this.targetPosition);
    this.arrivedAtTarget(this.targetPosition) && this.handleHit(this.target);
  }
}

export default TargetedArrow;
