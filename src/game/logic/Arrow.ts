import Phaser from 'phaser';
import {Attackable} from "../helpers/gameplayer-helper.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {showDamage, showGainedXp} from '../helpers/text-helpers.ts';
import Enemy from './Enemy.ts';
import Hero from './Hero.ts';

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
        this.target.takeDamage(this.owner.attackDamage, (target: Attackable) => {
            this.owner.onKilledTarget(target)
            // todo: check if this is hero
            // todo:  perhaps there is a better way to do this ?
            const baseXp = (target.owner as Enemy).xpAmount;
            const xpGainModifier = (this.owner.owner as Hero).stats.xpGainMultiplier;
            showGainedXp(this.scene, this.owner.owner as unknown as Vector2Like, baseXp * xpGainModifier)
        });
        showDamage(this.scene, this.target.owner as Vector2Like, this.owner.attackDamage, false);

        // this.target.takeDamage(10); // Assume the Enemy class has a takeDamage method
        this.destroy();
    }
}

export default Arrow;
