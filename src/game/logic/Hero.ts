import Phaser from "phaser";
import Enemy from "./Enemy.ts";
import Arrow from "./Arrow.ts";
import HealthBar from "./HealthBar.ts";
import MainScene from "../scenes/MainScene.ts";
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import GameObject = Phaser.GameObjects.GameObject;
import Group = Phaser.GameObjects.Group;

const COOLDOWN_THRESSHOLD = 10;

class Hero extends Phaser.Physics.Arcade.Sprite {
    health: number;
    maxHealth: number;
    healthBar: HealthBar;
    arrows: Group;
    attacksPerSecond: number;
    attackCooldown: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'hero');  // 'hero' is the key for the hero sprite
        scene.add.existing(this);     // Add the hero to the scene
        scene.physics.add.existing(this); // Enable physics for the hero
        this.setCollideWorldBounds(true); // Prevent the hero from moving offscreen

        // Initialize arrow group
        this.arrows = scene.add.group(); // Group to hold all arrows

        this.maxHealth = 100;
        this.health = this.maxHealth;
        
        this.attacksPerSecond = 2;
        this.attackCooldown = 0;

        // initial state
        this.state = 'idle';
        this.anims.play('idle');

        this.healthBar = new HealthBar(scene, {x: 20, y: 20}, 200, 20, this.maxHealth);

        scene.input.keyboard?.on('keydown-SPACE', () => {
            this.shootArrowAtNearestEnemy();
        });
    }

    // Method to update the hero's animation based on movement
    update(cursors: CursorKeys, delta: number) {
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
        this.arrows.getChildren().forEach((gameObject: GameObject) => {
            (gameObject as Arrow).update();
        });
        this.attackCooldown -= delta;
        if (this.attackCooldown <= COOLDOWN_THRESSHOLD)
        {
            this.attackCooldown = 0;
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
            this.scene.scene.start('GameOver');
        }
        this.healthBar.updateHealth(this.health);
    }

    shootArrowAtNearestEnemy() {
        if (this.attackCooldown < COOLDOWN_THRESSHOLD)
        {
            this.attackCooldown = 1000 / this.attacksPerSecond;
            const nearestEnemy = this.getNearestEnemy();

            if (nearestEnemy) {
                this.arrows.add(this.shootArrow(nearestEnemy));
            }
        }
    }

    getNearestEnemy(): Enemy | null {
        let nearestEnemy: Enemy | null = null;
        let minDistance = Number.MAX_VALUE;

        (this.scene as MainScene).enemies.getChildren().forEach((gameObject: GameObject) => {
            const enemy = gameObject as Enemy;
            const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (distance < minDistance) {
                nearestEnemy = enemy as Enemy;
                minDistance = distance;
            }
        });

        return nearestEnemy;
    }
}

export default Hero;