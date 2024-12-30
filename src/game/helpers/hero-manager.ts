import { Scene } from "phaser";

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

  registerHeroAnimations() {
    // Define the idle animation
    const activeColor = "green";
    ["idle", "run", "hero_attack"].forEach((animationKey) => {
      this.scene.anims.remove(animationKey);
    });

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
