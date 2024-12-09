import Phaser from 'phaser';
import {Attackable} from '../helpers/gameplayer-helper.ts';
import {showDamage, showGainedXp} from '../helpers/text-helpers.ts';
import Enemy from './Enemy.ts';
import Hero from './Hero.ts';
import StatsManager from '../helpers/stats-manager.ts';
import {addLogEntry, LogEntryCategory} from '../helpers/log-utils.ts';
import {COLOR_DANGER, COLOR_SUCCESS, COLOR_WARNING} from '../helpers/colors.ts';
import Vector2Like = Phaser.Types.Math.Vector2Like;

export class Arrow extends Phaser.Physics.Arcade.Sprite {
  target: Attackable;
  speed: number;
  owner: Attackable;
  targetPosition: Vector2Like;
  attackDamage: number;
  isCritical: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, targetPosition: Vector2Like, target: Attackable, speed: number = 500, owner: Attackable, attackDamage: number, isCritical: boolean) {
    super(scene, x, y, 'arrow');
    this.target = target;
    this.targetPosition = targetPosition;
    this.owner = owner;
    this.speed = speed;
    this.attackDamage = attackDamage;
    this.isCritical = isCritical;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setRotationTowardsTarget();
    // this.moveTowardsTarget();
  }

  // Rotate the arrow to face the target
  private setRotationTowardsTarget() {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetPosition.x, this.targetPosition.y);
    this.setRotation(angle + 45);
  }

  // Move the arrow towards the target
  private moveTowardsTarget() {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetPosition.x, this.targetPosition.y);
    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;

    this.setVelocity(velocityX, velocityY);
  }

  // Check if the arrow reached the target
  update() {
    this.moveTowardsTarget()
    if (Phaser.Math.Distance.Between(this.x, this.y, this.targetPosition.x, this.targetPosition.y) < 10) {
      this.handleHit();
    }
  }

  // Handle what happens when the arrow hits the target
  private handleHit() {
    // todo: check if this is hero
    // todo:  perhaps there is a better way to do this ?
    const hero: Hero = this.owner.owner as Hero;
    const stats: StatsManager = hero.stats;

    if (this.isCritical) {
      addLogEntry(':attacker inflicted :damage WRIT on :opponent', {
        attacker: [this.owner.name, COLOR_WARNING],
        damage: [this.attackDamage, COLOR_DANGER],
        opponent: [this.target.name, COLOR_DANGER],
      }, LogEntryCategory.Combat);
    } else {
      addLogEntry(`:attacker attacked :opponent for :damage DMG`, {
        attacker: [this.owner.name, COLOR_WARNING],
        opponent: [this.target.name, COLOR_DANGER],
        damage: [this.attackDamage, COLOR_DANGER],
      }, LogEntryCategory.Combat);
    }
    this.target.takeDamage(this.attackDamage, (target: Attackable) => {
      this.owner.onKilledTarget(target)
      const baseXp = (target.owner as Enemy).xpAmount;
      const xpGainModifier = stats.xpGainMultiplier;
      addLogEntry(':attacker killed :opponent', {
        attacker: [this.owner.name, COLOR_WARNING],
        opponent: [this.target.name, COLOR_DANGER],
      }, LogEntryCategory.Combat);
      const gainedXP = baseXp * xpGainModifier;
      showGainedXp(this.scene, this.owner.owner as unknown as Vector2Like, gainedXP)
      addLogEntry(':owner gained :xp XP', {
        owner: [this.owner.name, COLOR_WARNING],
        xp: [gainedXP, COLOR_SUCCESS],
      }, LogEntryCategory.Loot);
    });
    showDamage(this.scene, this.target.owner as Vector2Like, this.attackDamage, this.isCritical);
    this.destroy();
  }
}

export default Arrow;
