import {AbstractModule} from "./module-manager.ts";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import UiHelper from "../helpers/ui-helper.ts";

import {PowerupIconMap, PowerupType} from "../logic/drop/powerup/timed/powerupType.ts";
import {createAnimatedSprite} from "../helpers/text-helpers.ts";
import Sizer = UIPlugin.Sizer;
import Sprite = Phaser.GameObjects.Sprite;

class ActiveEffectsModule extends AbstractModule {
  private container?: Sizer;
  private panel?: ScrollablePanel;
  private icons: Partial<{ [key: string]: Sprite }> = {};

  start(): void {
    if (!this.container && !this.panel) {
      this.container = this.scene.rexUI.add.sizer({orientation: "horizontal", space: {item: 10}});

      this.panel = this.scene.rexUI.add.scrollablePanel(UiHelper.getDefaultScrollablePanelConfigs(
        this.scene, this.container, 70, 100, 100, 32,
        {slider: false, /*background: undefined*/},
      ))

      this.panel.layout();
    }
    Object.values(PowerupType).forEach(type => {
      const icon = createAnimatedSprite(this.scene, PowerupIconMap[type]);
      this.icons[type] = icon
      icon.setVisible(false);
    });
    this.scene.events.on("powerupCollected", ({type}: { type: PowerupType }) => this.updateUI(type, true));
    this.scene.events.on("powerupEnded", ({type}: { type: PowerupType }) => this.updateUI(type, false));
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
      this.icons[key]?.destroy();
      this.icons[key] = undefined;
    })
  }

  update(): void {
  }

  private updateUI(type: PowerupType, enabled: boolean) {
    if (this.panel && this.container) {
      const icon = this.icons[type] as Sprite;
      icon.setVisible(enabled);
      enabled ? this.container.add(icon) : this.container.remove(icon);
      this.panel.layout()
    }
  }
}

export default ActiveEffectsModule;
