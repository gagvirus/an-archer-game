import Phaser from "phaser";
import { Attackable } from "../helpers/gameplayer-helper.ts";
import { showDamage } from "../helpers/text-helpers.ts";
import { addLogEntry, LogEntryCategory } from "../helpers/log-utils.ts";
import { COLOR_DANGER, COLOR_WARNING } from "../helpers/colors.ts";
import { addStatistic } from "../helpers/accessors.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;

export class Arrow extends Phaser.Physics.Arcade.Sprite {
  target: Attackable;
  speed: number;
  owner: Attackable;
  targetPosition: Vector2Like;
  attackDamage: number;
  isCritical: boolean;
  hitRadius: number = 10;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    targetPosition: Vector2Like,
    target: Attackable,
    speed: number = 500,
    owner: Attackable,
    attackDamage: number,
    isCritical: boolean,
  ) {
    super(scene, x, y, "arrow");
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
      this.handleHit();
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

  // Handle what happens when the arrow hits the target
  private handleHit() {
    if (this.isCritical) {
      addStatistic("criticalHits", 1);
      addLogEntry(
        ":attacker inflicted :damage CRIT on :opponent",
        {
          attacker: [this.owner.name, COLOR_WARNING],
          damage: [this.attackDamage, COLOR_DANGER],
          opponent: [this.target.name, COLOR_DANGER],
        },
        LogEntryCategory.Combat,
      );
      addStatistic("damageInflicted", this.attackDamage);
    } else {
      addStatistic("regularHits", 1);
      addLogEntry(
        `:attacker attacked :opponent for :damage DMG`,
        {
          attacker: [this.owner.name, COLOR_WARNING],
          opponent: [this.target.name, COLOR_DANGER],
          damage: [this.attackDamage, COLOR_DANGER],
        },
        LogEntryCategory.Combat,
      );
      addStatistic("damageInflicted", this.attackDamage);
    }
    this.target.takeDamage(this.attackDamage, (target: Attackable) => {
      this.owner.onKilledTarget(target);
      addStatistic("enemiesKilled", 1);
      addLogEntry(
        ":attacker killed :opponent",
        {
          attacker: [this.owner.name, COLOR_WARNING],
          opponent: [this.target.name, COLOR_DANGER],
        },
        LogEntryCategory.Combat,
      );
    });
    showDamage(
      this.scene,
      this.target.owner as Vector2Like,
      this.attackDamage,
      this.isCritical,
    );
    this.destroy();
  }
}

export default Arrow;
