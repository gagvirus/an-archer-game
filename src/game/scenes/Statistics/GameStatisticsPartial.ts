import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import { Renderable } from "../../helpers/ui-helper.ts";
import {
  HEX_COLOR_DARK,
  HEX_COLOR_LIGHT,
  HEX_COLOR_LIGHT_GREY,
} from "../../helpers/colors.ts";
import { Scene } from "phaser";
import { createText } from "../../helpers/text-helpers.ts";
import { VectorZeroes } from "../../helpers/position-helper.ts";

class GameStatisticsPartial implements Renderable {
  private readonly scene: Phaser.Scene;
  private readonly width: number;
  private readonly height: number;
  constructor(scene: Scene, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.scene = scene;
  }
  render(container: Sizer) {
    const panel = this.scene.rexUI.add.scrollablePanel({
      width: this.width,
      height: this.height,
      scrollMode: "y",
      background: this.scene.rexUI.add.roundRectangle({
        color: HEX_COLOR_LIGHT_GREY,
        radius: 10,
      }),
      panel: {
        child: this.createContainer(),
        mask: { padding: 1 },
      },
      slider: {
        track: this.scene.rexUI.add.roundRectangle({
          radius: 5,
          color: HEX_COLOR_DARK,
        }),
        thumb: this.scene.rexUI.add.roundRectangle({
          width: 20,
          height: 40,
          radius: 10,
          color: HEX_COLOR_LIGHT,
        }),
      },
      mouseWheelScroller: {
        focus: false,
        speed: 0.1,
      },
      header: this.scene.rexUI.add.label({
        space: { left: 5, right: 5, top: 5, bottom: 15 },
        text: createText(this.scene, "Game Statistics", VectorZeroes(), 32),
        align: "center",
      }),
      space: {
        left: 15,
        right: 15,
        top: 15,
        bottom: 15,
        panel: 15,
        header: 15,
        footer: 15,
      },
    });
    container.add(panel).layout();
  }

  private createContainer() {
    const container = this.scene.rexUI.add.sizer();
    container.add(createText(this.scene, "hello", VectorZeroes()));
    return container.layout();
  }
}

export default GameStatisticsPartial;