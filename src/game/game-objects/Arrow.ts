import Phaser from "phaser";
import { Attackable } from "../helpers/gameplayer-helper.ts";
import AbstractProjectile from "./AbstractProjectile.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;

export class Arrow extends AbstractProjectile {
  target: Attackable;
  speed: number;
  owner: Attackable;
  targetPosition: Vector2Like;
  attackDamage: number;
  isCritical: boolean;
  hitRadius: number = 10;

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
    super(scene, x, y, "arrow", attackDamage, isCritical, owner);
    this.target = target;
    this.targetPosition = targetPosition;
    this.owner = owner;
    this.speed = speed;
    this.attackDamage = attackDamage;
    this.isCritical = isCritical;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setRotationTowardsTarget();
  }

  // Check if the arrow reached the target
  update() {
    this.moveTowardsTarget();
    this.getDistanceToTarget(this.targetPosition) < this.hitRadius &&
      this.handleHit(this.target);
  }

  getDistanceToTarget(target: Vector2Like) {
    return Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
  }

  // Rotate the arrow to face the target
  private setRotationTowardsTarget() {
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.targetPosition.x,
      this.targetPosition.y,
    );
    this.setRotation(angle + 45);
  }

  // Move the arrow towards the target
  private moveTowardsTarget() {
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.targetPosition.x,
      this.targetPosition.y,
    );
    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;

    this.setVelocity(velocityX, velocityY);
  }
}

export default Arrow;
