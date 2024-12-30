import { Scene } from "phaser";
import { getSelectedHeroClass } from "./registry-helper.ts";

class HeroManager {
  private static instance: HeroManager;
  private scene: Phaser.Scene;

  private constructor() {}

  static getInstance(scene: Scene) {
    if (!HeroManager.instance) {
      HeroManager.instance = new HeroManager();
    }
    HeroManager.instance.setScene(scene);
    return HeroManager.instance;
  }

  setScene(scene: Scene) {
    this.scene = scene;
  }

  getSelectedHero() {
    const heroClass = getSelectedHeroClass();
    return heroClasses[heroClass];
  }

  registerHeroAnimations() {
    // cleanup hero animations just in case
    ["idle", "run", "hero_attack"].forEach((animationKey) => {
      this.scene.anims.remove(animationKey);
    });
    const activeColor = this.getSelectedHero().color;

    // Define the idle animation
    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNumbers(
        `archer-${activeColor}-running`,
        {
          start: 0,
          end: 1,
        },
      ), // Adjust start and end based on your spritesheet
      frameRate: 5, // Animation speed
      repeat: -1, // Repeat indefinitely
    });

    // Define the running animation
    this.scene.anims.create({
      key: "run",
      frames: this.scene.anims.generateFrameNumbers(
        `archer-${activeColor}-running`,
        {
          start: 8,
          end: 15,
        },
      ), // Adjust start and end based on your spritesheet
      frameRate: 5, // Animation speed
      repeat: -1, // Repeat indefinitely
    });

    // Define the running animation
    this.scene.anims.create({
      key: "hero_attack",
      frames: this.scene.anims.generateFrameNumbers(
        `archer-${activeColor}-attack-normal`,
        {
          start: 24,
          end: 29,
        },
      ), // Adjust start and end based on your spritesheet
      frameRate: 5, // Animation speed
      repeat: -1, // Repeat indefinitely
    });
  }
}

export default HeroManager;

export enum HeroClass {
  speedster = "speedster",
  nuker = "nuker",
  tank = "tank",
  default = "default",
}

export interface HeroDefinition {
  damage: number;
  health: number;
  attackRate: number;
  baseAttackTime: number;
  healthRegenInterval: number;
  movementSpeed: number;
  color: "green" | "blue" | "red" | "yellow";
}

export const heroClasses: Record<HeroClass, HeroDefinition> = {
  [HeroClass.speedster]: {
    damage: 3,
    health: 10,
    attackRate: 200,
    baseAttackTime: 1,
    healthRegenInterval: 4000,
    movementSpeed: 240,
    color: "green",
  },
  [HeroClass.nuker]: {
    damage: 50,
    health: 20,
    attackRate: 150,
    baseAttackTime: 1.5,
    healthRegenInterval: 2000,
    movementSpeed: 160,
    color: "red",
  },
  [HeroClass.tank]: {
    damage: 10,
    health: 500,
    attackRate: 50,
    baseAttackTime: 2,
    healthRegenInterval: 1000,
    movementSpeed: 100,
    color: "blue",
  },
  [HeroClass.default]: {
    damage: 10,
    health: 100,
    attackRate: 100,
    baseAttackTime: 1.5,
    healthRegenInterval: 2000,
    movementSpeed: 160,
    color: "yellow",
  },
};
