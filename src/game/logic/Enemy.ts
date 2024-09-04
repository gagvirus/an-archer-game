import Phaser from 'phaser';
import Sprite = Phaser.Physics.Arcade.Sprite;
import GameObject = Phaser.GameObjects.GameObject;
import Hero from "./Hero";
import Group = Phaser.Physics.Arcade.Group;
import MainScene from "../scenes/MainScene.ts";
import HealthBar from "./HealthBar.ts";

class Enemy extends Sprite {
    attackRange: number;
    isAttacking: boolean;
    debugCircle: Phaser.GameObjects.Arc;
    hero: Hero;
    health: number;
    maxHealth: number;
    healthBar: HealthBar;

    constructor(scene: MainScene, x: number, y: number, attackRange: number = 100, showDebug: boolean = true) {
        super(scene, x, y, 'enemy');  // 'enemy' is the key for the enemy sprite
        scene.add.existing(this);     // Add to the scene
        scene.physics.add.existing(this); // Enable physics
        this.setCollideWorldBounds(true); // Prevent enemy from going offscreen

        this.maxHealth = 50;  // Example max health
        this.health = this.maxHealth;
        
        this.attackRange = attackRange;
        this.isAttacking = false;
        this.hero = scene.hero as Hero;  // Reference to the hero object

        this.setBounce(1);  // Add bounce for better collision response
        this.anims.play('skeleton_walk')

        this.debugCircle = scene.add.circle(this.x, this.y, this.attackRange, 0xffff00, 0.3);
        this.debugCircle.setVisible(showDebug);  // Show or hide the circle based on the parameter

        // Create a health bar for the enemy
        this.healthBar = new HealthBar(scene, this, 40, 5, this.maxHealth, {x: -20, y: -30});
    }

    // Reduce health and update the health bar
    takeDamage(damage: number) {
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
            this.destroy();
        }
        this.healthBar.updateHealth(this.health);
    }
    
    destroy()
    {
        this.healthBar.destroy();
        this.debugCircle.destroy();
        super.destroy()
    }

    move() {
        // Update the debug circle position
        this.debugCircle.setPosition(this.x, this.y);

        // Check if the hero is within the attack range
        const distanceToHero = Phaser.Math.Distance.Between(this.x, this.y, this.hero.x, this.hero.y);

        if (distanceToHero <= this.attackRange) {
            this.isAttacking = true;
            this.setVelocity(0);  // Stop moving
            this.attack();  // Attack the hero
        } else {
            this.isAttacking = false;
            this.chaseHero();  // Continue chasing the hero
        }
        this.healthBar.draw()
    }

    attack() {
        this.hero.takeDamage(10)
    }

    // Move the enemy towards the target (the hero)
    chaseHero() {
        const speed = Phaser.Math.Between(50, 100); // Random speed for each enemy

        // Calculate the angle and direction towards the target
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.hero.x, this.hero.y);
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        // Set velocity towards the target
        this.setVelocity(velocityX, velocityY);

        // Flip the texture based on the direction
        if (velocityX < 0) {
            this.setFlipX(true);  // Flip the texture to the left
        } else {
            this.setFlipX(false); // Keep the texture facing right
        }
    }

    // Ensure enemies maintain distance from each other
    avoidCollision(enemies: Group, minDistance: number) {
        enemies.getChildren().forEach((otherEnemy: GameObject) => {
            const enemy = otherEnemy as Enemy;
            if (otherEnemy !== this) {
                const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);

                // Check if the distance is less than the minimum distance
                if (distance < minDistance) { // Adjust the distance as needed
                    const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
                    this.setVelocity(
                        Math.cos(angle) * -minDistance, // Push away from the other enemy
                        Math.sin(angle) * -minDistance  // Adjust the push strength as needed
                    );
                }
            }
        });
    }
}

export default Enemy;