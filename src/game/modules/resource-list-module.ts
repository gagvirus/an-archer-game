import {createText, formatNumber} from "../helpers/text-helpers.ts";
import {Scene} from "phaser";
import Hero from "../logic/Hero.ts";
import {AbstractModule} from "./module-manager.ts";
import {ResourceType} from "../logic/Resource.ts";

class DpsIndicatorModule extends AbstractModule {
  private resourceTexts: Partial<{ [key in ResourceType]: Phaser.GameObjects.Text }> = {};
  private hero: Hero;

  constructor(scene: Scene, hero: Hero) {
    super(scene);
    this.hero = hero;
  }

  start() {
    let i = 0;
    for (const [key, value] of Object.entries(ResourceType)) {
      this.resourceTexts[value] = createText(this.scene, `${key}s: 0`, {
        x: this.scene.scale.width - 75,
        y: 80 + i * 25,
      }, 16);
      i++;
    }
  }

  stop() {
    for (const value of Object.values(ResourceType)) {
      this.resourceTexts[value]?.destroy();
      this.resourceTexts[value] = undefined;
    }
  }

  update() {
    const resources = this.hero.getResources();
    Object.keys(resources).forEach((resourceType) => {
      const text = `${resourceType}s: ${formatNumber(resources[resourceType as ResourceType])}`;
      this.resourceTexts[resourceType as ResourceType]?.setText(text);
    })
  }
}

export default DpsIndicatorModule;
