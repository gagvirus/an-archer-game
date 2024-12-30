import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { createCenteredText, formatNumber } from "../helpers/text-helpers.ts";
import { HEX_COLOR_DANGER } from "../helpers/colors.ts";
import { ISceneLifecycle } from "./contracts/ISceneLifecycle.ts";

interface GameOverData {
  statistics: GameOverDataStatistics;
}

interface GameOverDataStatistics {
  score: number;
  levelsPassed: number;
}

export class GameOver extends Scene implements ISceneLifecycle {
  camera: Phaser.Cameras.Scene2D.Camera;
  private statistics: GameOverDataStatistics;

  constructor() {
    super("GameOver");
  }

  init(data: GameOverData) {
    this.statistics = data?.statistics ?? {};
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(HEX_COLOR_DANGER);
    const { score, levelsPassed } = this.statistics;

    createCenteredText(this, "Game Over", -100, 48, false);
    createCenteredText(this, "Main Menu", 0, 32, true).on("pointerdown", () => {
      this.scene.start("MainMenu");
    });

    createCenteredText(this, `Score: ${formatNumber(score)}`, 100, 28);

    createCenteredText(
      this,
      `Levels Passed: ${formatNumber(levelsPassed)}`,
      150,
      28,
    );

    EventBus.emit("current-scene-ready", this);
  }
}
