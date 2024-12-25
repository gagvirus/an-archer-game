import { createText, formatNumber } from "../helpers/text-helpers.ts";
import { Scene } from "phaser";
import Hero from "../logic/Hero.ts";
import { AbstractModule } from "./module-manager.ts";
import { ResourceType } from "../logic/drop/resource/Resource.ts";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import UiHelper from "../helpers/ui-helper.ts";
import { VectorZeroes } from "../helpers/position-helper.ts";
import { COLOR_WHITE } from "../helpers/colors.ts";

class ResourceListModule extends AbstractModule {
  private container?: Sizer;
  private panel?: ScrollablePanel;
  private resources: Partial<{ [key: string]: Phaser.GameObjects.Text }> = {};
  private hero: Hero;

  constructor(scene: Scene, hero: Hero) {
    super(scene);
    this.hero = hero;
  }

  start() {
    if (!this.container && !this.panel) {
      this.container = this.scene.rexUI.add.sizer({
        orientation: "vertical",
        space: { item: 10 },
        width: 100,
        height: 100,
      });

      this.panel = this.scene.rexUI.add.scrollablePanel(
        UiHelper.getDefaultScrollablePanelConfigs(
          this.scene,
          this.container,
          this.scene.scale.width - 65,
          200,
          100,
          150,
          {
            slider: false,
            align: { panel: "right" } /*background: undefined*/,
          },
        ),
      );

      Object.entries(ResourceType).forEach(([key, value]) => {
        const resourceText = createText(
          this.scene,
          `${key}s: 0`,
          VectorZeroes(),
          16,
          "right",
          false,
          COLOR_WHITE,
          { fixedWidth: 100 },
        );
        this.resources[value] = resourceText;
        this.container?.add(resourceText);
      });

      this.container.layout();
      this.panel.layout();
    }
  }

  stop() {
    if (this.container) {
      this.container.destroy();
      this.container = undefined;
    }
    if (this.panel) {
      this.panel.destroy();
      this.panel = undefined;
    }
    Object.keys(ResourceType).forEach((key) => {
      this.resources[key]?.destroy();
      this.resources[key] = undefined;
    });
  }

  update() {
    const resources = this.hero.getResources();
    Object.keys(resources).forEach((resourceType) => {
      const text = `${resourceType}s: ${formatNumber(resources[resourceType as ResourceType])}`;
      this.resources[resourceType as ResourceType]?.setText(text);
    });
  }
}

export default ResourceListModule;
