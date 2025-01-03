import GameObject = Phaser.GameObjects.GameObject;
import Sprite = Phaser.GameObjects.Sprite;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;
import Tile = Phaser.Tilemaps.Tile;
import Enemy from "../game-objects/Enemy.ts";
import {
  getRandomPositionAwayFromPoint,
  getTileCoordinate,
  TILE_SIZE,
} from "../helpers/position-helper.ts";
import { createAnimatedText } from "../helpers/text-helpers.ts";
import Portal from "../game-objects/Portal.ts";
import Tower from "../game-objects/Tower.ts";
import { addLogEntry, LogEntryCategory } from "../helpers/log-utils.ts";
import { COLOR_WARNING } from "../helpers/colors.ts";
import {
  isDebugMode,
  isMultipleResourceDropsEnabled,
} from "../helpers/registry-helper.ts";
import { Coin } from "../game-objects/drop/resource/Coin.ts";
import { Soul } from "../game-objects/drop/resource/Soul.ts";
import {
  Resource,
  ResourceType,
} from "../game-objects/drop/resource/Resource.ts";
import {
  getRandomItem,
  getRandomNumberBetweenRange,
  randomChance,
} from "../helpers/random-helper.ts";
import { ResourceDropChance } from "../game-objects/enemies.ts";
import Magnet from "../game-objects/drop/powerup/Magnet.ts";
import { Drop } from "../game-objects/drop/Drop.ts";

import { powerups } from "../game-objects/drop/powerup/powerups.ts";
import DoubleDamage from "../game-objects/drop/powerup/timed/DoubleDamage.ts";
import DoubleSpeed from "../game-objects/drop/powerup/timed/DoubleSpeed.ts";
import Invulnerability from "../game-objects/drop/powerup/timed/Invulnerability.ts";
import UiIcon from "../ui/icon.ts";
import { addStatistic } from "../helpers/accessors.ts";
import AbstractGameplayScene from "./AbstractGameplayScene.ts";
import { Module } from "../modules/module-manager.ts";
import StageInfoModule from "../modules/stage-info-module.ts";

class MainScene extends AbstractGameplayScene {
  stage: number;
  portal: Portal;

  constructor() {
    // Call the Phaser.Scene constructor and pass the scene key
    super("MainScene");
  }

  // Create game objects
  create() {
    super.create();
    // initialize the portal
    this.portal = new Portal(this, 400, 400, this.hero);

    if (isDebugMode()) {
      this.drops.add(new Magnet(this, 150, 150));
      this.drops.add(new DoubleDamage(this, 200, 150));
      this.drops.add(new DoubleDamage(this, 220, 150));
      this.drops.add(new DoubleSpeed(this, 150, 200));
      this.drops.add(new DoubleSpeed(this, 170, 200));
      this.drops.add(new Invulnerability(this, 200, 200));
      this.drops.add(new Invulnerability(this, 220, 200));
      this.drops.add(new Invulnerability(this, 100, 200));
    }

    this.physics.add.overlap(
      this.hero.collectLootCircle,
      this.drops,
      this.onResourcePull,
      undefined,
      this,
    );

    this.stage = 1;
    this.scene
      .get("BuildMenuScene")
      .events.on("buildComplete", (data: { buildings: Tower[][] }) => {
        if (data.buildings) {
          data.buildings.forEach((towersRow: Tower[]) => {
            towersRow.forEach((tower: Tower) => {
              this.buildings.add(tower.clone(this));
            });
          });
        }
      });

    this.scene
      .get("StatsScene")
      .events.on("statsUpdated", () => this.recalculateStats());
    this.events.on("powerupCollected", () => this.recalculateStats());
    this.events.on("powerupEnded", () => this.recalculateStats());
    this.events.on("enemyKilled", (data: { enemy: Enemy }) =>
      this.onEnemyKilled(data.enemy),
    );

    // Listener for keyboard inputs
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (event.key === "b") {
        this.onPause();
        // get disabled tiles and pass to build scene
        this.scene.launch("BuildMenuScene", {
          occupiedTiles: this.getOccupiedTiles(),
        });
      }

      if (event.key === "c") {
        this.openStatsScreen();
      }

      if (isDebugMode()) {
        if (event.key === "m") {
          this.magnetEffect();
        }
      }
    });
    this.startStage();

    new UiIcon(this, 50, this.scale.height - 50, "hand-sparkle")
      .setInteractive()
      .on("pointerdown", () => this.openStatsScreen());
    this.children.bringToTop(this.hero);
  }

  onShutdown() {
    super.onShutdown();
    this.moduleManager.disable(Module.stageInfo);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.portal.update();
  }

  onResourcePull(
    _: Tile | GameObjectWithBody | undefined,
    resource: Tile | GameObjectWithBody,
  ) {
    // if drop is not following hero, add to "follow list"
    if (!this.dropsFollowing.contains(resource as GameObject)) {
      (resource as Resource).setStartedPulling();
      this.dropsFollowing.add(resource as GameObject);
    }
  }

  spawnSoul(x: number, y: number, amount: number = 1) {
    return new Soul(this, x, y, amount);
  }

  spawnCoin(x: number, y: number, amount: number = 1) {
    return new Coin(this, x, y, amount);
  }

  getDropFromType(
    x: number,
    y: number,
    type: ResourceType,
    amount: number,
  ): Resource {
    switch (type) {
      case ResourceType.soul:
        return this.spawnSoul(x, y, amount);
      case ResourceType.coin:
      default:
        return this.spawnCoin(x, y, amount);
    }
  }

  dropResource(x: number, y: number, type: ResourceType, amount: number) {
    const drop: Resource = this.getDropFromType(x, y, type, amount);
    return this.drop(x, y, drop);
  }

  dropPowerup(x: number, y: number) {
    const powerup = getRandomItem(powerups);
    return this.drop(x, y, new powerup.className(this, x, y));
  }

  drop(x: number, y: number, drop: Drop) {
    this.drops.add(drop);
    // Randomize direction and distance for the throw
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2); // Random direction
    const radius = Phaser.Math.FloatBetween(50, 100); // Distance to "throw"

    const targetX = x + Math.cos(angle) * radius;
    const targetY = y + Math.sin(angle) * radius;

    // Set the drop's velocity to "throw" it
    const throwSpeed = 200; // Speed of the throw
    const velocityX = Math.cos(angle) * throwSpeed;
    const velocityY = Math.sin(angle) * throwSpeed;

    (drop as GameObjectWithBody).body.velocity.set(velocityX, velocityY);

    // Optional: Add a tween for a smooth "throw" animation
    this.tweens.add({
      targets: drop,
      x: targetX,
      y: targetY,
      ease: "Power2",
      duration: 500,
      onComplete: () => {
        // Stop the drop after it lands
        (drop as GameObjectWithBody)?.body?.velocity.set(0, 0);
      },
    });
  }

  getOccupiedTiles() {
    const occupiedTiles: Vector2Like[] = [];
    const objects: Sprite[] = [
      this.hero,
      this.portal,
      ...this.enemies.getChildren(),
      ...this.buildings.getChildren(),
    ] as Sprite[];
    objects.forEach((obj: Sprite) => {
      if (obj instanceof Tower) {
        occupiedTiles.push(obj.getOccupyingCoordinates());
      } else {
        const bounds = obj.getBounds();
        const minX = bounds.x;
        const maxX = bounds.x + bounds.width;
        const minY = bounds.y;
        const maxY = bounds.y + bounds.height;
        for (let x = minX; x <= maxX; x += TILE_SIZE) {
          for (let y = minY; y <= maxY; y += TILE_SIZE) {
            console.log("OTHER", getTileCoordinate({ x, y }));
            occupiedTiles.push(getTileCoordinate({ x, y }));
          }
        }
      }
    });
    return occupiedTiles;
  }

  onEnemyKilled(enemy: Enemy) {
    this.dropLoot(enemy);
    if (this.enemies.countActive() < 1) {
      this.portal.setDisabled(false);
      // stage passed
      addStatistic("levelsPassed", 1);
    }
  }

  dropLoot(enemy: Enemy) {
    const dropRate = this.hero.attributes.dropRate;
    const dropAmount = this.hero.attributes.dropAmount;
    // there is a constant chance to drop a powerup
    const BASE_POWERUP_DROP_CHANCE = 1;
    const powerupChance = Phaser.Math.Clamp(
      BASE_POWERUP_DROP_CHANCE * dropRate,
      BASE_POWERUP_DROP_CHANCE,
      BASE_POWERUP_DROP_CHANCE * 10,
    );
    if (randomChance(powerupChance)) {
      this.dropPowerup(enemy.x, enemy.y);
    }
    Object.keys(enemy.drops).forEach((resourceType) => {
      const [baseMinAmount, baseMaxAmount, baseChance] = enemy.drops[
        resourceType as ResourceType
      ] as ResourceDropChance;
      const chance = Phaser.Math.Clamp(
        baseChance * dropRate,
        1,
        baseChance <= 10 ? 50 : 90,
      );
      if (randomChance(chance)) {
        const baseAmount = getRandomNumberBetweenRange([
          baseMinAmount,
          baseMaxAmount,
        ]);
        if (dropAmount >= 2) {
          const dropsCount = isMultipleResourceDropsEnabled()
            ? dropAmount < 6
              ? dropAmount
              : 5
            : 1;
          const amount = Math.round(baseAmount / dropsCount);
          for (let i = 0; i < dropsCount; i++) {
            this.dropResource(
              enemy.x,
              enemy.y,
              resourceType as ResourceType,
              amount,
            );
          }
        } else {
          this.dropResource(
            enemy.x,
            enemy.y,
            resourceType as ResourceType,
            Math.round(baseAmount * dropAmount),
          );
        }
      }
    });
  }

  startStage() {
    this.portal.setDisabled(true);
    createAnimatedText(this, `Stage ${this.stage}`, 2000);
    this.spawnEnemies(); // Spawn more enemies for the new stage
    addLogEntry(
      "Start Stage :stage - :enemies_count enemies spawned.",
      {
        stage: [this.stage, COLOR_WARNING],
        enemies_count: [this.enemies.countActive(true), COLOR_WARNING],
      },
      LogEntryCategory.World,
    );
  }

  protected registerAndEnableModules() {
    super.registerAndEnableModules();
    this.moduleManager.register(Module.stageInfo, new StageInfoModule(this));
    this.moduleManager.enable(Module.stageInfo);
  }

  get enemiesForStage() {
    return this.stage * 3;
  }

  spawnEnemies() {
    const numEnemies = this.enemiesForStage; // Increase the number of enemies each stage

    for (let i = 0; i < numEnemies; i++) {
      const { x, y } = getRandomPositionAwayFromPoint(
        this.scale.width - 50,
        this.scale.height - 50,
        this.hero,
        200,
      );
      const enemy = new Enemy(this, x, y);
      this.enemies.add(enemy);
    }
  }

  nextStage() {
    this.stage += 1; // Increase stage
    this.enemies.clear(true, true); // Clear existing enemies
    this.startStage();
  }

  magnetEffect() {
    this.drops.getChildren().forEach((drop) => {
      if (drop instanceof Resource) {
        this.onResourcePull(undefined, drop as Tile | GameObjectWithBody);
      }
    });
  }

  recalculateStats() {
    this.hero.attackable.registerHealthRegenerationIfNecessary();
    this.hero.attackable.setMaxHealth(this.hero.maxHealth);
    this.hero.attackable.attackDamage = this.hero.attackDamage;
    this.hero.attackable.attacksPerSecond = this.hero.attacksPerSecond;
    this.hero.xpManager.xpBar.setUnallocatedStats(
      this.hero.attributes.unallocatedStats,
    );
    // update the health bar ui
    // update the health regen tick
  }

  private openStatsScreen() {
    this.onPause();
    this.scene.launch("StatsScene", { attributes: this.hero.attributes });
  }
}

export default MainScene;
