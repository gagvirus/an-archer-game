import Phaser from "phaser";
import Enemy from "./Enemy.ts";
import Arrow from "./Arrow.ts";
import HealthBar from "./HealthBar.ts";
import MainScene from "../scenes/MainScene.ts";
import { Attackable, XpManager } from "../helpers/gameplayer-helper.ts";
import XpBar from "./XpBar.ts";
import {
  isAutoAttackEnabled,
  isDebugMode,
} from "../helpers/registry-helper.ts";
import { addLogEntry, LogEntryCategory } from "../helpers/log-utils.ts";
import { VectorZeroes } from "../helpers/position-helper.ts";
import { CustomCursorKeysDown } from "../helpers/keyboard-helper.ts";
import { COLOR_SUCCESS, COLOR_WARNING } from "../helpers/colors.ts";
import { ResourceType } from "./drop/resource/Resource.ts";
import { randomChance } from "../helpers/random-helper.ts";
import { AttributeManager } from "../stats/attribute-manager.ts";
import { Attribute } from "../stats/attributes.ts";
import GameObject = Phaser.GameObjects.GameObject;
import Group = Phaser.GameObjects.Group;
import Arc = Phaser.GameObjects.Arc;

class Hero extends Phaser.Physics.Arcade.Sprite {
  arrows: Group;
  attackable: Attackable;
  xpManager: XpManager;
  _level: number;
  pullDistance: number = 100;
  pullForce: number = 200;
  collectDistance: number = 25;
  collectLootCircle: Arc;
  private resources: { [key in ResourceType]: number } = {
    [ResourceType.soul]: 0,
    [ResourceType.coin]: 0,
  };
  walkSpeed: number;
  public attributes: AttributeManager;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "hero"); // 'hero' is the key for the hero sprite
    scene.add.existing(this); // Add the hero to the scene
    scene.physics.add.existing(this); // Enable physics for the hero
    this.setCollideWorldBounds(true); // Prevent the hero from moving offscreen
    this.attributes = new AttributeManager(this.scene);

    this._level = 1;
    this.name = "Hero";
    this.walkSpeed = 160;
    this.collectLootCircle = scene.physics.add.existing(
      this.scene.add.circle(this.x, this.y, this.pullDistance, 0x0000ff, 0.2),
    );
    this.collectLootCircle.setVisible(isDebugMode(scene.game));

    // Initialize arrow group
    this.arrows = scene.add.group(); // Group to hold all arrows

    // initial state
    this.state = "idle";
    this.anims.play("idle");

    if (!isAutoAttackEnabled(scene.game)) {
      scene.input.keyboard?.on("keydown-SPACE", () => {
        this.attackable.attack();
      });
    }
    this.attackable = new Attackable(
      this.scene,
      this.attacksPerSecond, // attacks per second
      this.attackDamage, // attack damage
      this.maxHealth, // initial health
      (maxHealth: number) =>
        new HealthBar(
          scene,
          { x: 20, y: 20 },
          200,
          20,
          maxHealth,
          VectorZeroes(),
          true,
        ),
      () => {
        this.attackable.stopRegeneration();
        this.scene.scene.start("GameOver");
      },
      () => {
        const nearestEnemy = this.getNearestEnemy();
        if (nearestEnemy) {
          this.arrows.add(this.shootArrow(nearestEnemy));
        }
      },
      this,
    );

    this.xpManager = new XpManager(this.initXpBar, this.onLevelUp);
  }

  collectResource(name: ResourceType, amount: number = 1) {
    this.resources[name] += amount;
  }

  getResources() {
    return this.resources;
  }

  get attackDamage() {
    // todo: remove this perhaps
    return this.attributes.getAttribute(Attribute.damage);
  }

  get attacksPerSecond() {
    // todo: remove this perhaps
    return this.attributes.getAttribute(Attribute.attacksPerSecond);
  }

  get maxHealth() {
    // todo: remove this perhaps
    return this.attributes.getAttribute(Attribute.health);
  }

  get damagePerSecond() {
    // todo: remove this perhaps
    return this.attributes.getDps();
  }

  onLevelUp = (newLevel: number) => {
    addLogEntry(
      ":hero has become LVL :level",
      {
        hero: [this.name, COLOR_WARNING],
        level: [newLevel, COLOR_SUCCESS],
      },
      LogEntryCategory.World,
    );
    this._level = newLevel;
    this.attackable.setMaxHealth(this.maxHealth, false);
    this.attackable.attackDamage = this.attackDamage;
    this.attackable.attacksPerSecond = this.attacksPerSecond;
    const statPointsToGrant = this.statPointsToGrant;
    this.attributes.unallocatedStats += statPointsToGrant;
    this.attributes.setHeroLevel(newLevel);
    addLogEntry(
      ":hero has received :stats stat points",
      {
        hero: [this.name, COLOR_WARNING],
        stats: [statPointsToGrant, COLOR_SUCCESS],
      },
      LogEntryCategory.Loot,
    );
    this.xpManager.xpBar.setUnallocatedStats(this.attributes.unallocatedStats);
    this.scene.events.emit("levelUp");
  };

  get statPointsToGrant() {
    if (this._level % 100 < 1) {
      // on level 100, 200... grant 50 points
      return 50;
    }
    if (this._level % 50 < 1) {
      // on level 50, 150... grant 20 points
      return 25;
    }
    if (this._level % 25 < 1) {
      // on level 25, 75, 125... grant 10 points
      return 10;
    }
    if (this._level % 10 < 1) {
      // on level 10, 20... grant 5 points
      return 5;
    }
    if (this._level % 5 < 1) {
      // on level 5, 15, 35... grant 3 points
      return 3;
    }
    return 1;
  }

  initXpBar = (level: number, currentXp: number, xpToNextLevel: number) =>
    new XpBar(
      this.scene,
      {
        x: 20,
        y: 50,
      },
      200,
      20,
      level,
      currentXp,
      xpToNextLevel,
    );

  // Method to update the hero's animation based on movement
  // @ts-expect-error we *must* receive time
  update(cursors: CustomCursorKeysDown, time: number, delta: number) {
    if (cursors.left || cursors.right || cursors.up || cursors.down) {
      if (this.state !== "run") {
        this.state = "run";
        this.anims.play("run", true);
      }
    } else {
      if (this.state !== "idle") {
        this.state = "idle";
        this.anims.play("idle", true);
      }
    }
    isAutoAttackEnabled(this.scene.game) && this.attackable.attack();
    this.arrows.getChildren().forEach((gameObject: GameObject) => {
      (gameObject as Arrow).update();
    });
    this.attackable.update(delta);
    // pull circle follows the hero
    this.collectLootCircle.x = this.x;
    this.collectLootCircle.y = this.y;
    this.handleHeroMovement(cursors);
  }

  handleHeroMovement(cursors: CustomCursorKeysDown) {
    const speed = this.attributes.getAttribute(Attribute.movementSpeed);
    // Handle hero movement
    if (cursors.left) {
      this.setFlipX(true); // Flip the sprite to face left
      this.setVelocityX(-speed);
    } else if (cursors.right) {
      this.setFlipX(false); // Flip the sprite to face left
      this.setVelocityX(speed);
    } else {
      this.setVelocityX(0);
    }

    if (cursors.up) {
      this.setVelocityY(-speed);
    } else if (cursors.down) {
      this.setVelocityY(speed);
    } else {
      this.setVelocityY(0);
    }
  }

  shootArrow(target: Enemy) {
    let attackDamage = this.attackable.attackDamage;

    const isCritical = randomChance(
      this.attributes.getAttribute(Attribute.criticalChance),
    );
    if (isCritical) {
      attackDamage *= this.attributes.getAttribute(Attribute.criticalAmount);
    }
    target.soonToBeHealth -= attackDamage;
    const arrow = new Arrow(
      this.scene,
      this.x,
      this.y,
      target,
      target.attackable,
      500,
      this.attackable,
      attackDamage,
      isCritical,
    );
    this.scene.add.existing(arrow);
    return arrow;
  }

  getNearestEnemy(): Enemy | null {
    let nearestEnemy: Enemy | null = null;
    let minDistance = Number.MAX_VALUE;

    const enemies = (this.scene as MainScene).enemies
      .getChildren()
      .filter((enemy: GameObject) => !(enemy as Enemy).isToBeKilled);

    enemies.forEach((gameObject: GameObject) => {
      const enemy = gameObject as Enemy;
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        enemy.x,
        enemy.y,
      );
      if (distance < minDistance) {
        nearestEnemy = enemy as Enemy;
        minDistance = distance;
      }
    });

    return nearestEnemy;
  }
}

export default Hero;
