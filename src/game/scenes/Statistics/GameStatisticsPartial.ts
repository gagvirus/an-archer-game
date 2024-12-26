import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import { Renderable } from "../../helpers/ui-helper.ts";
import {
  HEX_COLOR_DARK,
  HEX_COLOR_LIGHT,
  HEX_COLOR_PRIMARY,
} from "../../helpers/colors.ts";
import { Scene } from "phaser";
import { createText } from "../../helpers/text-helpers.ts";
import { VectorZeroes } from "../../helpers/position-helper.ts";

class GameStatisticsPartial implements Renderable {
  private scene: Phaser.Scene;
  private width: number;
  private height: number;
  constructor(scene: Scene, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.scene = scene;
  }
  render(container: Sizer) {
    const panel = this.scene.rexUI.add.scrollablePanel({
      // x: this.scene.scale.width / 2,
      // y: this.scene.scale.height / 2,
      width: this.width,
      height: this.height,
      scrollMode: "y",
      background: this.scene.rexUI.add.roundRectangle({
        strokeColor: HEX_COLOR_LIGHT,
        color: HEX_COLOR_PRIMARY,
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
        background: this.scene.rexUI.add.roundRectangle({
          color: HEX_COLOR_PRIMARY,
        }),
        text: this.scene.add.text(0, 0, "Settings", { fontSize: 20 }),
        align: "center",
      }),
      footer: this.scene.rexUI.add.label({
        space: { left: 5, right: 5, top: 5, bottom: 5 },
        background: this.scene.rexUI.add.roundRectangle({
          color: HEX_COLOR_PRIMARY,
        }),
        text: this.scene.add
          .text(0, 0, "Go Back", { fontSize: 20 })
          .setInteractive()
          .on("pointerup", () => {
            this.scene.scene.start("MainMenu");
          }),
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
