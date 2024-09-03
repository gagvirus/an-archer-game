import Phaser from "phaser";
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import Enemy from "./Enemy.ts";
import Arrow from "./Arrow.ts";
import HealthBar from "./HealthBar.ts";

class Hero extends Phaser.Physics.Arcade.Sprite {
    health: number;
    maxHealth: number;
    healthBar: HealthBar;
    
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'hero');  // 'hero' is the key for the hero sprite
        scene.add.existing(this);     // Add the hero to the scene
        scene.physics.add.existing(this); // Enable physics for the hero
        this.setCollideWorldBounds(true); // Prevent the hero from moving offscreen

        this.maxHealth = 100;
        this.health = this.maxHealth;

        // initial state
        this.state = 'idle';

        this.healthBar = new HealthBar(scene, 20, 20, 200, 20, this.maxHealth);
    }

    // Method to update the hero's animation based on movement
    update(cursors: CursorKeys) {
        if (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown) {
            if (this.state !== 'run') {
                this.state = 'run';
                this.anims.play('run', true);
            }
        } else {
            if (this.state !== 'idle') {
                this.state = 'idle';
                this.anims.play('idle', true);
            }
        }
    }

    shootArrow(target: Enemy) {
        const arrow = new Arrow(this.scene, this.x, this.y, target);
        this.scene.add.existing(arrow);
        return arrow;
    }

    // Reduce health and update the health bar
    takeDamage(damage: number) {
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
        }
        this.healthBar.updateHealth(this.health);
    }
}


export default Hero;