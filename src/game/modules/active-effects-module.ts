import {AbstractModule} from "./module-manager.ts";
import Hero from "../logic/Hero.ts";
import {Scene} from "phaser";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import UiHelper from "../helpers/ui-helper.ts";

import {PowerupIconMap, PowerupType} from "../logic/drop/powerup/timed/powerupType.ts";
import {createAnimatedSprite} from "../helpers/text-helpers.ts";
import Sizer = UIPlugin.Sizer;

class ActiveEffectsModule extends AbstractModule {
  private hero: Hero;
  private container?: Sizer;
  private panel?: ScrollablePanel;

  constructor(scene: Scene, hero: Hero) {
    super(scene);
    this.hero = hero;
  }

  start(): void {
    if (!this.container && !this.panel) {
      this.container = this.scene.rexUI.add.sizer({orientation: "horizontal", space: {item: 10}});

      const width = 100;
      const height = 32;
      const x = 70;
      const y = 100;

      this.panel = this.scene.rexUI.add.scrollablePanel(UiHelper.getDefaultScrollablePanelConfigs(
        this.scene,
        this.container,
        x,
        y,
        width,
        height,
        {slider: false, /*background: undefined*/},
      ))

      this.panel.layout();
    }
    this.scene.events.on("powerupCollected", () => this.updateUI());
    this.scene.events.on("powerupEnded", () => this.updateUI());
  }

  stop(): void {
    if (this.container) {
      this.container.destroy();
      this.container = undefined;
    }
    if (this.panel) {
      this.panel.destroy();
      this.panel = undefined;
    }
  }

  update(): void {
  }

  private updateUI() {
    if (this.panel && this.container) {
      this.container.getChildren().forEach((child) => {
        child.destroy();
      });

      for (const type of Object.values(PowerupType)) {
        if (this.hero.extra.isEnabled(type)) {
          console.log("adding", type)
          this.container?.add(createAnimatedSprite(this.scene, PowerupIconMap[type]))
        }
      }
      this.container.layout()
      this.panel.layout()

    }
  }
}

export default ActiveEffectsModule;
