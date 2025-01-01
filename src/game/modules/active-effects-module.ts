import { AbstractModule } from "./module-manager.ts";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import UiHelper from "../helpers/ui-helper.ts";

import {
  PowerupIconMap,
  PowerupType,
} from "../game-objects/drop/powerup/timed/powerupType.ts";
import { createAnimatedSprite } from "../helpers/text-helpers.ts";
import Sizer = UIPlugin.Sizer;
import Sprite = Phaser.GameObjects.Sprite;

interface Icon {
  sprite: Sprite;
  isEnabled: boolean;
}

class ActiveEffectsModule extends AbstractModule {
  private container?: Sizer;
  private panel?: ScrollablePanel;
  private icons: Partial<{
    [key: string]: Icon;
  }> = {};

  start(): void {
    if (!this.container && !this.panel) {
      this.container = this.scene.rexUI.add.sizer({
        orientation: "horizontal",
        space: { item: 10 },
      });

      this.panel = this.scene.rexUI.add.scrollablePanel(
        UiHelper.getDefaultScrollablePanelConfigs(
          this.scene,
          this.container,
          70,
          100,
          100,
          36,
          { slider: false /*background: undefined*/ },
        ),
      );
      this.panel.layout();

      this.scene.events.on(
        "powerupCollected",
        ({ type }: { type: PowerupType }) => this.updateUI(type, true),
      );
      this.scene.events.on("powerupEnded", ({ type }: { type: PowerupType }) =>
        this.updateUI(type, false),
      );
    }
    Object.values(PowerupType).forEach((type) => {
      const icon = createAnimatedSprite(this.scene, PowerupIconMap[type]);
      this.icons[type] = { sprite: icon, isEnabled: false };
      icon.setVisible(false);
    });
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
    Object.keys(this.icons).forEach((key) => {
      this.icons[key]?.sprite.destroy();
      this.icons[key] = undefined;
    });
    this.scene.events.off("powerupCollected").off("powerupEnded");
  }

  update(): void {}

  private updateUI(type: PowerupType, enable: boolean) {
    if (this.panel && this.container) {
      const { sprite, isEnabled } = this.icons[type] as Icon;
      sprite.setVisible(enable);
      if (!isEnabled && enable) {
        this.container.add(sprite);
      }
      if (isEnabled && !enable) {
        this.container.remove(sprite);
      }
      (this.icons[type] as Icon).isEnabled = enable;
      this.panel.layout();
    }
  }
}

export default ActiveEffectsModule;
