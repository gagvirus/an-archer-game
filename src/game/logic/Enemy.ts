import Phaser from 'phaser';
import Hero from "./Hero";
import MainScene from "../scenes/MainScene.ts";
import HealthBar from "./HealthBar.ts";
import {Attackable, randomChance} from '../helpers/gameplayer-helper.ts';
import {enemies, EnemyDef} from "./enemies.ts";
import {getRandomItem} from "../helpers/random-helper.ts";
import Sprite = Phaser.Physics.Arcade.Sprite;
import GameObject = Phaser.GameObjects.GameObject;
import Group = Phaser.Physics.Arcade.Group;
import {isDebugMode} from "../helpers/registry-helper.ts";
import {HEX_COLOR_WARNING} from '../helpers/colors.ts';
import {showDamage, showEvaded} from '../helpers/text-helpers.ts';
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {addLogEntry} from '../helpers/log-utils.ts';

class Enemy extends Sprite {
    attackRange: number;
    isAttacking: boolean = false;
    debugCircle: Phaser.GameObjects.Arc;
    hero: Hero;
    speed: number;
    maxHealth: number;
    attackDamage: number;
    attacksPerSecond: number = 1;
    attackCooldown: number;
    type: string = 'enemy';
    attackable: Attackable;
    xpAmount: number;

    constructor(scene: MainScene, x: number, y: number, enemyDef?: EnemyDef) {
        super(scene, x, y, 'enemy');  // 'enemy' is the key for the enemy sprite
        scene.add.existing(this);     // Add to the scene
        scene.physics.add.existing(this); // Enable physics
        this.setCollideWorldBounds(true); // Prevent enemy from going offscreen

        this.hero = scene.hero as Hero;  // Reference to the hero object

        this.setBounce(1);  // Add bounce for better collision response

        this.instantiate(enemyDef);

        this.debugCircle = scene.add.circle(this.x, this.y, this.attackRange, HEX_COLOR_WARNING, 0.3);
        this.debugCircle.setVisible(isDebugMode(scene.game));

        this.attackCooldown = 0;
        // Create a health bar for the enemy
        this.anims.play(`${this.type}_walk`)

        this.attackable = new Attackable(
            this.scene,
            this.attacksPerSecond,
            this.attackDamage,
            this.maxHealth,
            (maxHealth: number) => new HealthBar(scene, this, 40, 5, maxHealth, {x: -20, y: -30}),
            () => {
                this.destroy();
                scene.onEnemyKilled();
            },
            () => {
                const isEvaded = randomChance(this.hero.stats.evadeChancePercent);
                if (isEvaded) {
                    addLogEntry(`${this.hero.name} evaded attack from ${this.name}`);
                    showEvaded(this.scene, this.hero as Vector2Like);
                } else {
                    const armorRating = this.hero.stats.armorRatingAttribute;
                    const pureDamage = this.attackDamage;
                    const blockedDamage = pureDamage * armorRating / 100;
                    const damageDealt = pureDamage - blockedDamage;
                    const blockedDamageMessage = blockedDamage > 1 ? `, but ${this.hero.attackable.name} blocked ${blockedDamage} DMG` : '';
                    addLogEntry(`${this.name} attacked ${this.hero.attackable.name} for ${damageDealt} DMG${blockedDamageMessage}`)
                    this.hero.attackable.takeDamage(this.attackDamage);
                    showDamage(this.scene, this.hero as Vector2Like, damageDealt, false);
                }
            },
            this,
        )
    }

    // in this method the derives classes shall extend the enemy stats (attack damage & range, movement speed & health)
    instantiate = (enemyDef?: EnemyDef): void => {
        if (!enemyDef) {
            const enemiesFilteredByHeroLevel = enemies.filter((enemyDef: EnemyDef) => {
                return enemyDef.minLevel <= this.hero.xpManager.level && enemyDef.maxLevel >= this.hero.xpManager.level;
            });
            enemyDef = getRandomItem<EnemyDef>(enemiesFilteredByHeroLevel)
        }
        this.maxHealth = enemyDef.maxHealth;
        this.speed = enemyDef.speed;
        this.attackRange = enemyDef.attackRange;
        this.attackDamage = enemyDef.attackDamage;
        this.attacksPerSecond = enemyDef.attacksPerSecond;
        this.xpAmount = enemyDef.xpAmount;
        this.type = enemyDef.type;
        this.scale = enemyDef.scale;
        this.name = enemyDef.name;
        if (enemyDef.tint)
        {
            this.tint = enemyDef.tint;
        }
    };

    destroy() {
        this.attackable.healthBar.destroy();
        this.debugCircle.destroy();
        super.destroy()
    }

    // @ts-expect-error we *must* receive time
    update(time: number, delta: number) {
        this.move();
        this.avoidCollision((this.scene as MainScene).enemies, 50);
        this.avoidCollision((this.scene as MainScene).buildings, 50);
        this.attackable.update(delta)
    }

    move() {
        // Update the debug circle position
        this.debugCircle.setPosition(this.x, this.y);

        // Check if the hero is within the attack range
        const distanceToHero = Phaser.Math.Distance.Between(this.x, this.y, this.hero.x, this.hero.y);

        if (distanceToHero <= this.attackRange) {
            this.isAttacking = true;
            this.setVelocity(0);  // Stop moving
            this.attackable.attack();  // Attack the hero
        } else {
            this.isAttacking = false;
            this.chaseHero();  // Continue chasing the hero
        }
        this.attackable.healthBar.draw()
    }

    // Move the enemy towards the target (the hero)
    chaseHero() {
        // Calculate the angle and direction towards the target
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.hero.x, this.hero.y);
        const velocityX = Math.cos(angle) * this.speed;
        const velocityY = Math.sin(angle) * this.speed;

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
