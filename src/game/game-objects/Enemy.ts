import Phaser from "phaser";
import Hero from "./Hero.ts";
import HealthBar from "./HealthBar.ts";
import { Attackable } from "../helpers/gameplayer-helper.ts";
import { enemies, EnemyDef, EnemyDrops } from "./enemies.ts";
import { getRandomItem, randomChance } from "../helpers/random-helper.ts";
import { isDebugMode } from "../helpers/registry-helper.ts";
import {
  COLOR_DANGER,
  COLOR_WARNING,
  HEX_COLOR_WARNING,
} from "../helpers/colors.ts";
import { showDamage, showEvaded } from "../helpers/text-helpers.ts";
import { addLogEntry, LogEntryCategory } from "../helpers/log-utils.ts";
import { addStatistic } from "../helpers/accessors.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import Sprite = Phaser.Physics.Arcade.Sprite;
import GameObject = Phaser.GameObjects.GameObject;
import Group = Phaser.Physics.Arcade.Group;

import Vector2Like = Phaser.Types.Math.Vector2Like;

class Enemy extends Sprite {
  attackRange: number;
  isAttacking: boolean = false;
  gamePlayScene: AbstractGameplayScene;
  attackRadiusCircle: Phaser.GameObjects.Arc;
  hero: Hero;
  speed: number;
  maxHealth: number;
  attackDamage: number;
  attacksPerSecond: number = 1;
  attackCooldown: number;
  type: string = "enemy";
  attackable: Attackable;
  xpAmount: number;
  // when an arrow is on the way, the health bar is not yet updated, but we need to keep track of "actual" health
  // that will become when the arrow hits the enemy, so we would be able to determine whether it's about to be killed
  soonToBeHealth: number;
  drops: EnemyDrops;
  constructor(
    scene: AbstractGameplayScene,
    x: number,
    y: number,
    enemyDef?: EnemyDef,
  ) {
    super(scene, x, y, "enemy"); // 'enemy' is the key for the enemy sprite
    this.gamePlayScene = scene;
    scene.add.existing(this); // Add to the scene
    scene.physics.add.existing(this); // Enable physics
    this.setCollideWorldBounds(true); // Prevent enemy from going offscreen

    this.hero = scene.hero as Hero; // Reference to the hero object

    this.setBounce(1); // Add bounce for better collision response

    this.instantiate(enemyDef);

    this.attackRadiusCircle = scene.add.circle(
      this.x,
      this.y,
      this.attackRange,
      HEX_COLOR_WARNING,
      0.3,
    );
    this.attackRadiusCircle.setVisible(isDebugMode());
    this._instanceId = Phaser.Math.RND.uuid();

    this.attackCooldown = 0;
    // Create a health bar for the enemy
    this.anims.play(`${this.type}_walk`);
    this.soonToBeHealth = this.maxHealth;

    this.attackable = new Attackable(
      this.gamePlayScene,
      this.attacksPerSecond,
      this.attackDamage,
      this.maxHealth,
      (maxHealth: number) =>
        new HealthBar(scene, this, 40, 5, maxHealth, { x: -20, y: -30 }),
      () => {
        this.destroy();
        scene.events.emit("enemyKilled", { enemy: this });
      },
      () => {
        const isEvaded = randomChance(this.hero.attributes.evadeChance);
        if (isEvaded) {
          addStatistic("timesEvaded", 1);
          addLogEntry(
            ":hero evaded attack from :opponent",
            {
              hero: [this.hero.name, COLOR_WARNING],
              opponent: [this.name, COLOR_DANGER],
            },
            LogEntryCategory.Combat,
          );
          showEvaded(this.gamePlayScene, this.hero as Vector2Like);
        } else {
          const blockedDamage = this.hero.attributes.getFinalDamageReduction(
            this.attackDamage,
          );
          addStatistic("timesHit", 1);
          const damageDealt = this.attackDamage - blockedDamage;
          addLogEntry(
            ":enemy attacked :opponent for :damage DMG, but :blocker blocked :blocked DMG",
            {
              enemy: [this.name, COLOR_DANGER],
              opponent: [this.hero.name, COLOR_WARNING],
              damage: [this.attackDamage, COLOR_DANGER],
              blocker: [this.hero.name, COLOR_WARNING],
              blocked: [blockedDamage, COLOR_WARNING],
            },
            LogEntryCategory.Combat,
          );
          addStatistic("damageReceived", damageDealt);
          addStatistic("damageBlocked", blockedDamage);

          this.hero.attackable.takeDamage(damageDealt);
          showDamage(
            this.gamePlayScene,
            this.hero as Vector2Like,
            damageDealt,
            false,
          );
        }
      },
      this,
    );
  }

  private _instanceId: string;

  get instanceId() {
    return this._instanceId;
  }

  get isToBeKilled() {
    return this.soonToBeHealth <= 0;
  }

  get score() {
    return Math.round((this.maxHealth * this.attackDamage) / 10);
  }

  // in this method the derives classes shall extend the enemy stats (attack damage & range, movement speed & health)
  instantiate = (enemyDef?: EnemyDef): void => {
    if (!enemyDef) {
      const enemiesFilteredByHeroLevel = enemies.filter(
        (enemyDef: EnemyDef) => {
          return (
            enemyDef.minLevel <= this.hero.xpManager.level &&
            enemyDef.maxLevel >= this.hero.xpManager.level
          );
        },
      );
      enemyDef = getRandomItem<EnemyDef>(enemiesFilteredByHeroLevel);
    }
    this.maxHealth = enemyDef.maxHealth;
    this.speed = enemyDef.speed;
    this.attackRange = enemyDef.attackRange;
    this.attackDamage = enemyDef.attackDamage;
    this.attacksPerSecond = enemyDef.attacksPerSecond;
    this.drops = enemyDef.drops;
    this.xpAmount = enemyDef.xpAmount;
    this.type = enemyDef.type;
    this.scale = enemyDef.scale;
    this.name = enemyDef.name;
    if (enemyDef.tint) {
      this.tint = enemyDef.tint;
    }
  };

  destroy() {
    this.attackable.healthBar.destroy();
    this.attackRadiusCircle.destroy();
    super.destroy();
  }

  // @ts-expect-error we *must* receive time
  update(time: number, delta: number) {
    this.move();
    const scene = this.gamePlayScene;
    this.avoidCollision(scene.enemies, 50);
    this.avoidCollision(scene.buildings, 50);
    this.attackable.update(delta);
  }

  move() {
    // Update the debug circle position
    this.attackRadiusCircle.setPosition(this.x, this.y);

    // Check if the hero is within the attack range
    const distanceToHero = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.hero.x,
      this.hero.y,
    );

    if (distanceToHero <= this.attackRange) {
      this.isAttacking = true;
      this.setVelocity(0); // Stop moving
      this.attackable.attack(); // Attack the hero
    } else {
      this.isAttacking = false;
      this.chaseHero(); // Continue chasing the hero
    }
    this.attackable.healthBar.draw();
  }

  // Move the enemy towards the target (the hero)
  chaseHero() {
    // Calculate the angle and direction towards the target
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.hero.x,
      this.hero.y,
    );

    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;

    // Set velocity towards the target
    this.setVelocity(velocityX, velocityY);

    // Flip the texture based on the direction
    if (velocityX < 0) {
      this.setFlipX(true); // Flip the texture to the left
    } else {
      this.setFlipX(false); // Keep the texture facing right
    }
  }

  // Ensure enemies maintain distance from each other
  avoidCollision(enemies: Group, minDistance: number) {
    enemies.getChildren().forEach((otherEnemy: GameObject) => {
      const enemy = otherEnemy as Enemy;
      if (otherEnemy !== this) {
        const distance = Phaser.Math.Distance.Between(
          this.x,
          this.y,
          enemy.x,
          enemy.y,
        );

        // Check if the distance is less than the minimum distance
        if (distance < minDistance) {
          // Adjust the distance as needed
          const angle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            enemy.x,
            enemy.y,
          );
          this.setVelocity(
            Math.cos(angle) * -minDistance, // Push away from the other enemy
            Math.sin(angle) * -minDistance, // Adjust the push strength as needed
          );
        }
      }
    });
  }
}

export default Enemy;
