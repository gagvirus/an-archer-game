import {Scene} from "phaser";
import {HEX_COLOR_GREY, HEX_COLOR_LIGHT_GREY, HEX_COLOR_WHITE} from "./colors.ts";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import IConfig = ScrollablePanel.IConfig;
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";

class UiHelper {
  static getDefaultScrollablePanelConfigs(scene: Scene, container: Sizer, x: number, y: number, width: number, height: number): IConfig {
    return {
      x, y, width, height,

      scrollMode: 0, // 0 for vertical scrolling
      background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10, HEX_COLOR_LIGHT_GREY),

      panel: {
        child: container,

        mask: {
          padding: 1
        }
      },

      slider: {
        track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, HEX_COLOR_GREY),
        thumb: scene.rexUI.add.roundRectangle(0, 0, 20, 30, 10, HEX_COLOR_WHITE)
      },
      space: {left: 10, right: 10, top: 10, bottom: 10, panel: 10}
    };
  }
}

export default UiHelper;
