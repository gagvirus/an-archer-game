import Phaser from 'phaser';
import {Attackable, randomChance} from '../helpers/gameplayer-helper.ts';
import {showDamage, showGainedXp} from '../helpers/text-helpers.ts';
import Enemy from './Enemy.ts';
import Hero from './Hero.ts';
import StatsManager from '../helpers/stats-manager.ts';
import {addFancyLogEntry, LogEntryCategory} from '../helpers/log-utils.ts';
import {COLOR_DANGER, COLOR_WARNING} from '../helpers/colors.ts';
import Vector2Like = Phaser.Types.Math.Vector2Like;

export class Arrow extends Phaser.Physics.Arcade.Sprite {
    target: Attackable;
    speed: number;
    owner: Attackable;
    targetPosition: Vector2Like;

    constructor(scene: Phaser.Scene, x: number, y: number, targetPosition: Vector2Like, target: Attackable, speed: number = 500, owner: Attackable) {
        super(scene, x, y, 'arrow');
        this.target = target;
        this.targetPosition = targetPosition;
        this.owner = owner;
        this.speed = speed;

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
        let attackDamage = this.owner.attackDamage;
        // todo: check if this is hero
        // todo:  perhaps there is a better way to do this ?
        const hero: Hero = this.owner.owner as Hero;
        const stats: StatsManager = hero.stats;
        const isCritical = randomChance(stats.criticalChancePercent);
        if (isCritical) {
            attackDamage *= stats.criticalExtraDamageMultiplier;
        }

        if (isCritical) {
            addFancyLogEntry(':attacker inflicted :damage WRIT on :opponent', {
                attacker: [this.owner.name, COLOR_WARNING],
                damage: [attackDamage, COLOR_DANGER],
                opponent: [this.target.name, COLOR_DANGER],
            }, LogEntryCategory.Combat);
        } else {
            addFancyLogEntry(`:attacker attacked :opponent for :damage DMG`, {
                attacker: [this.owner.name, COLOR_WARNING],
                opponent: [this.target.name, COLOR_DANGER],
                damage: [attackDamage, COLOR_DANGER],
            }, LogEntryCategory.Combat);
        }
        this.target.takeDamage(attackDamage, (target: Attackable) => {
            this.owner.onKilledTarget(target)
            const baseXp = (target.owner as Enemy).xpAmount;
            const xpGainModifier = stats.xpGainMultiplier;
            addFancyLogEntry(':attacker killed :opponent', {
                attacker: this.owner.name,
                opponent: this.target.name,
            }, LogEntryCategory.Combat);
            const gainedXP = baseXp * xpGainModifier;
            showGainedXp(this.scene, this.owner.owner as unknown as Vector2Like, gainedXP)
            addFancyLogEntry(':owner gained :xp XP', {
                owner: this.owner.name,
                xp: gainedXP,
            }, LogEntryCategory.Loot);
        });
        showDamage(this.scene, this.target.owner as Vector2Like, attackDamage, isCritical);

        // this.target.takeDamage(10); // Assume the Enemy class has a takeDamage method
        this.destroy();
    }
}

export default Arrow;
