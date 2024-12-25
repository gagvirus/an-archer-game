import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { createCenteredText } from "../helpers/text-helpers.ts";
import { HEX_COLOR_DANGER } from "../helpers/colors.ts";
import { ISceneLifecycle } from "../ISceneLifecycle.ts";
import {
  getScore,
  getStatistic,
  resetStatistics,
} from "../helpers/accessors.ts";

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

    createCenteredText(this, `Score: ${getScore()}`, 100, 28);

    const levelsPassed = getStatistic("levelsPassed");
    createCenteredText(this, `Levels Passed: ${levelsPassed}`, 150, 28);

    EventBus.emit("current-scene-ready", this);

    resetStatistics();
  }
}
