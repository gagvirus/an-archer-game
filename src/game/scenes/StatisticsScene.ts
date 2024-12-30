import { Scene } from "phaser";
import { ISceneLifecycle } from "../ISceneLifecycle.ts";
import GameStatisticsPartial from "./Statistics/GameStatisticsPartial.ts";
import { createText } from "../helpers/text-helpers.ts";

class StatisticsScene extends Scene implements ISceneLifecycle {
  constructor() {
    super("StatisticsScene");
  }

  create() {
    const { width, height } = this.scale;

    createText(
      this,
      "Go Back",
      {
        x: 100,
        y: height - 100,
      },
      20,
    )
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("MainMenu");
      });

    const statisticsMenu = this.rexUI.add.sizer({
      orientation: "vertical",
      x: width / 2,
      y: height / 2,
      width: (width - 40) / 2,
      height: height - 40,
    });
    const renderer = new GameStatisticsPartial(
      this,
      (width - 40) / 2,
      height - 40,
      true,
    );
    renderer.render(statisticsMenu);
    statisticsMenu.layout();
  }
}

export default StatisticsScene;
