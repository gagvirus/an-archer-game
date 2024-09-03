import Phaser from 'phaser';
import Enemy from './Enemy';

export class Arrow extends Phaser.Physics.Arcade.Sprite {
    target: Enemy;
    speed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, target: Enemy, speed: number = 500) {
        super(scene, x, y, 'arrow');
        this.target = target;
        this.speed = speed;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setRotationTowardsTarget();
        // this.moveTowardsTarget();
    }

    // Rotate the arrow to face the target
    private setRotationTowardsTarget() {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        this.setRotation(angle + 45);
    }

    // Move the arrow towards the target
    private moveTowardsTarget() {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        const velocityX = Math.cos(angle) * this.speed;
        const velocityY = Math.sin(angle) * this.speed;

        this.setVelocity(velocityX, velocityY);
    }

    // Check if the arrow reached the target
    update() {
        this.moveTowardsTarget()
        if (Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y) < 10) {
            this.handleHit();
        }
    }

    // Handle what happens when the arrow hits the target
    private handleHit() {
        this.target.takeDamage(10);
        // this.target.takeDamage(10); // Assume the Enemy class has a takeDamage method
        this.destroy();
    }
}

export default Arrow;