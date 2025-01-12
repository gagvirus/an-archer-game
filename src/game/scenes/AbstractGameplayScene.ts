import { Scene } from "phaser";
import { ISceneLifecycle } from "./contracts/ISceneLifecycle.ts";
import Hero from "../game-objects/Hero.ts";
import Enemy from "../game-objects/Enemy.ts";
import { createCursorKeys } from "../helpers/keyboard-helper.ts";
import { Drop } from "../game-objects/drop/Drop.ts";
import { Resource } from "../game-objects/drop/resource/Resource.ts";
import ModuleManager, { Module } from "../modules/module-manager.ts";
import LogModule from "../modules/log-module.ts";
import ActiveEffectsModule from "../modules/active-effects-module.ts";
import ResourceListModule from "../modules/resource-list-module.ts";
import ScoreModule from "../modules/score-module.ts";
import DpsIndicatorModule from "../modules/dps-indicator-module.ts";
import FpsCounterModule from "../modules/fps-counter-module.ts";
import { isDebugMode } from "../helpers/registry-helper.ts";
import { addStatistic, resetStatistics } from "../helpers/accessors.ts";
import SkillsManager from "../active-skills/skills-manager.ts";
import { ACTIVE_SKILLS_MAP, ActiveSkillKey } from "../active-skills/utils.ts";
import UiIcon from "../ui/icon.ts";
import { VectorZeroes } from "../helpers/position-helper.ts";
import GameObject = Phaser.GameObjects.GameObject;
import GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;
import Group = Phaser.Physics.Arcade.Group;

abstract class AbstractGameplayScene extends Scene implements ISceneLifecycle {
  enemies: Group;
  drops: Group;
  dropsFollowing: Group;
  buildings: Group;
  playingSince: number;
  protected moduleManager!: ModuleManager;
  protected skillsManager: SkillsManager;

  private _hero: Hero;

  public get hero() {
    return this._hero;
  }

  create() {
    // Initialize the hero in the center of the canvas
    this._hero = new Hero(this, this.scale.width / 2, this.scale.height / 2);

    this.registerAndEnableModules();
    this.registerEventListeners();
    this.drops = this.physics.add.group();
    this.dropsFollowing = this.physics.add.group();
    this.enemies = this.physics.add.group(); // Group to hold all enemies
    this.buildings = this.physics.add.group();
    this.children.bringToTop(this.hero);
    this.skillsManager = new SkillsManager(this, this.enemies);
    this.playingSince = Date.now();
    this.renderActiveSkillsPanel();
  }

  update(time: number, delta: number) {
    // Make enemies move towards the hero and avoid collision with each other
    this.enemies.getChildren().forEach((gameObject: GameObject) => {
      (gameObject as Enemy).update(time, delta);
    });
    this.skillsManager.update();

    const cursors = createCursorKeys(this);

    // Update hero based on input
    this.hero.update(cursors, time, delta);
    this.moduleManager.update();
    this.dropsFollowHero();
  }

  dropsFollowHero() {
    this.dropsFollowing.getChildren().forEach((gameObject) => {
      // Calculate the direction to pull the resource
      const drop: Drop = gameObject as Drop;
      const { x, y, startedPulling } = drop;
      const { body } = drop as GameObjectWithBody;

      const elapsedTime = (Date.now() - startedPulling) / 1000;
      const angle = Phaser.Math.Angle.Between(x, y, this.hero.x, this.hero.y);

      const pullX = Math.cos(angle) * this.hero.pullForce * elapsedTime;
      const pullY = Math.sin(angle) * this.hero.pullForce * elapsedTime;

      body.velocity.x = pullX;
      body.velocity.y = pullY;

      // Check if the resource is within collectDistance
      const distance = Phaser.Math.Distance.Between(
        this.hero.x,
        this.hero.y,
        x,
        y,
      );
      if (distance < this.hero.collectDistance) {
        drop.onCollected();
        this.dropsFollowing.remove(drop as Resource, true, true);
        this.drops.remove(drop as Resource);
      }
    });
  }

  onPause() {
    this.scene.pause();
    this.hero.attackable.stopRegeneration();
    this.events.emit("GamePaused");
    addStatistic(
      "secondsPlayed",
      Math.round((Date.now() - this.playingSince) / 1000),
    );
  }

  onResume() {
    this.hero.attackable.registerHealthRegenerationIfNecessary();
    this.events.emit("GameResumed");
    this.playingSince = Date.now();
  }

  onShutdown() {
    this.moduleManager.disable(Module.fpsCounter);
    this.moduleManager.disable(Module.dpsIndicator);
    this.moduleManager.disable(Module.resourceList);
    this.moduleManager.disable(Module.activeEffects);
    this.moduleManager.disable(Module.logs);
    this.hero.attackable.stopRegeneration();
    addStatistic(
      "secondsPlayed",
      Math.round((Date.now() - this.playingSince) / 1000),
    );
    // this shall happen when player moves to main menu, or dies
    resetStatistics();
  }

  protected registerAndEnableModules() {
    // Initialize the module manager
    this.moduleManager = ModuleManager.getInstance(this);
    // Register modules
    this.moduleManager.register(Module.fpsCounter, new FpsCounterModule(this));
    this.moduleManager.register(
      Module.dpsIndicator,
      new DpsIndicatorModule(this, this.hero),
    );
    this.moduleManager.register(Module.score, new ScoreModule(this));
    this.moduleManager.register(
      Module.resourceList,
      new ResourceListModule(this, this.hero),
    );
    this.moduleManager.register(
      Module.activeEffects,
      new ActiveEffectsModule(this),
    );
    // cleanup any previous logs
    LogModule.cleanEntries();
    this.moduleManager.register(Module.logs, new LogModule(this));
    // Enable the FPS counter initially
    this.moduleManager.enable(Module.fpsCounter);
    this.moduleManager.enable(Module.dpsIndicator);
    this.moduleManager.enable(Module.resourceList);
    this.moduleManager.enable(Module.activeEffects);
    this.moduleManager.enable(Module.logs);
    this.moduleManager.enable(Module.score);
  }

  protected registerEventListeners() {
    this.events.on("resume", () => this.onResume());
    this.events.on("shutdown", () => this.onShutdown());

    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        this.onPause();
        this.scene.launch("PauseMenu");
      }

      if (isDebugMode()) {
        if (event.key === "k") {
          this.hero.attackable.takeDamage(Infinity);
        }
      }

      if (event.key == "f") {
        this.moduleManager.toggle(Module.fpsCounter);
      }

      if (event.key == "g") {
        this.moduleManager.toggle(Module.dpsIndicator);
      }

      if (event.key == "l") {
        this.moduleManager.toggle(Module.logs);
      }
    });

    const keys = Object.values(ActiveSkillKey);
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (keys.includes(event.key as ActiveSkillKey)) {
        this.skillsManager.activateSkillByHotkey(event.key as ActiveSkillKey);
      }
    });
  }

  private renderActiveSkillsPanel() {
    const buttonSize = 64; // Set button size
    const padding = 10;
    const totalWidth =
      ACTIVE_SKILLS_MAP.length * (buttonSize + padding) - padding;

    const skillsBar = this.rexUI.add.sizer({
      x: this.cameras.main.width / 2 - totalWidth / 2,
      y: this.cameras.main.height - buttonSize,
      width: totalWidth,
      height: buttonSize,
      orientation: "horizontal",
      space: { item: padding },
    });

    ACTIVE_SKILLS_MAP.forEach((skill) => {
      const button = new UiIcon(
        this,
        VectorZeroes(),
        buttonSize,
        skill.icon,
        skill.key,
        skill.description,
        () => {
          this.skillsManager.activateSkill(skill);
        },
      )
        .setInteractive()
        .on("pointerdown", () => {
          this.skillsManager.activateSkill(skill);
        });
      skillsBar.add(button, { proportion: 0, expand: false });
    });

    skillsBar.layout();
  }
}

export default AbstractGameplayScene;
