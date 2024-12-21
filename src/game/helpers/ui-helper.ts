import { Scene } from "phaser";
import {
  HEX_COLOR_GREY,
  HEX_COLOR_LIGHT_GREY,
  HEX_COLOR_WHITE,
} from "./colors.ts";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import IConfig = ScrollablePanel.IConfig;

class UiHelper {
  static getDefaultSliderConfig(scene: Scene) {
    return {
      track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, HEX_COLOR_GREY),
      thumb: scene.rexUI.add.roundRectangle(0, 0, 20, 30, 10, HEX_COLOR_WHITE),
    };
  }

  static getDefaultScrollablePanelConfigs(
    scene: Scene,
    container: Sizer,
    x: number,
    y: number,
    width: number,
    height: number,
    configOverride: Partial<IConfig> = {},
  ): IConfig {
    const slider =
      configOverride.slider === undefined
        ? UiHelper.getDefaultSliderConfig(scene)
        : configOverride.slider;

    return {
      ...{
        x,
        y,
        width,
        height,

        scrollMode: "vertical",
        background: scene.rexUI.add.roundRectangle(
          0,
          0,
          10,
          10,
          10,
          HEX_COLOR_LIGHT_GREY,
        ),

        panel: {
          child: container,

          mask: {
            padding: 1,
          },
        },

        slider,
        space: { left: 10, right: 10, top: 10, bottom: 10, panel: 10 },
      },
      ...configOverride,
    };
  }
}

export interface Renderable {
  render: (container: Sizer) => void;
}

export default UiHelper;
