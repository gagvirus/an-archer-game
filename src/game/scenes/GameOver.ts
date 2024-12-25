import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { createCenteredText } from "../helpers/text-helpers.ts";
import { HEX_COLOR_DANGER } from "../helpers/colors.ts";
import { ISceneLifecycle } from "../ISceneLifecycle.ts";
import { StatisticsManager } from "../statistics/statistics-manager.ts";

export class GameOver extends Scene implements ISceneLifecycle {
  camera: Phaser.Cameras.Scene2D.Camera;

  constructor() {
    super("GameOver");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(HEX_COLOR_DANGER);

    createCenteredText(this, "Game Over", -100, 48, false);
    createCenteredText(this, "Main Menu", 0, 32, true).on("pointerdown", () => {
      this.scene.start("MainMenu");
    });

    const score = StatisticsManager.getInstance().getScore();
    createCenteredText(this, `Score: ${score}`, 100, 28);

    EventBus.emit("current-scene-ready", this);
  }
}
