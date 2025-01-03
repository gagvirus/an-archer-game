import { createText, formatNumber } from "../helpers/text-helpers.ts";
import { Scene } from "phaser";
import Hero from "../game-objects/Hero.ts";
import { AbstractModule } from "./module-manager.ts";

class DpsIndicatorModule extends AbstractModule {
  private dpsText?: Phaser.GameObjects.Text;
  private readonly hero: Hero;

  constructor(scene: Scene, hero: Hero) {
    super(scene);
    this.hero = hero;
  }

  start() {
    if (!this.dpsText) {
      this.dpsText = createText(
        this.scene,
        "DPS: 0",
        {
          x: this.scene.scale.width - 50,
          y: 20,
        },
        16,
      );
    }
  }

  stop() {
    if (this.dpsText) {
      this.dpsText.destroy();
      this.dpsText = undefined;
    }
  }

  update() {
    if (this.dpsText && this.hero) {
      this.dpsText.setText(`DPS ${formatNumber(this.hero.damagePerSecond)}`);
    }
  }
}

export default DpsIndicatorModule;
