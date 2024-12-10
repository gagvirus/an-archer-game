import {AbstractModule} from "./module-manager.ts";
import Hero from "../logic/Hero.ts";
import {Scene} from "phaser";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import UiHelper from "../helpers/ui-helper.ts";
import Sizer = UIPlugin.Sizer;
import {createText} from "../helpers/text-helpers.ts";
import {VectorZeroes} from "../helpers/position-helper.ts";

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
      this.container = this.scene.rexUI.add.sizer({orientation: "vertical", space: {item: 10}});

      const width = 100;
      const height = 100;
      const x = 500;
      const y = 500;

      this.panel = this.scene.rexUI.add.scrollablePanel(UiHelper.getDefaultScrollablePanelConfigs(
        this.scene,
        this.container,
        x,
        y,
        width,
        height,
        {slider: false},
      ))

      this.container.add(createText(this.scene, 'hello world', VectorZeroes()))
      this.panel.layout();
    }
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
    console.log(this.hero);
  }

}

export default ActiveEffectsModule;
