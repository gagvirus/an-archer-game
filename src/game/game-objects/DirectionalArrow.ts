import AbstractProjectile from "./AbstractProjectile.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import { Attackable } from "../helpers/gameplayer-helper.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;

export class DirectionalArrow extends AbstractProjectile {
  private targetPosition: Vector2Like;
  constructor(
    scene: AbstractGameplayScene,
    x: number,
    y: number,
    attackDamage: number,
    isCritical: boolean,
    owner: Attackable,
    speed: number,
    hitRadius: number,
    angle: number,
    distance: number,
  ) {
    super(
      scene,
      x,
      y,
      "arrow",
      attackDamage,
      isCritical,
      owner,
      speed,
      hitRadius,
    );

    this.targetPosition = this.calculateTarget(angle, distance);
    this.faceTarget(this.targetPosition);
  }

  calculateTarget(angle: number, distance: number): { x: number; y: number } {
    // Convert the angle from degrees to radians
    const radians = Phaser.Math.DegToRad(angle);

    // Calculate the offset based on the angle and distance
    const dx = Math.cos(radians) * distance;
    const dy = Math.sin(radians) * distance;

    // Return the new coordinates relative to this.x and this.y
    return {
      x: this.x + dx,
      y: this.y - dy, // Subtract dy because Phaser's Y-axis increases downward
    };
  }

  update() {
    this.moveTowardsTarget(this.targetPosition);
    this.isHitting(this.targetPosition) && this.destroy();
  }
}
