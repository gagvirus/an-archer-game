import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { createCenteredText } from "../helpers/text-helpers.ts";
import { HEX_COLOR_DANGER } from "../helpers/colors.ts";
import { ISceneLifecycle } from "../ISceneLifecycle.ts";

export class GameOver extends Scene implements ISceneLifecycle {
  camera: Phaser.Cameras.Scene2D.Camera;
  gameOverText: Phaser.GameObjects.Text;
  mainMenuText: Phaser.GameObjects.Text;

  constructor() {
    super("GameOver");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(HEX_COLOR_DANGER);

    this.gameOverText = createCenteredText(this, "Game Over", -100, 48, false);
    this.mainMenuText = createCenteredText(this, "Main Menu", 0, 32, true);

    this.mainMenuText.on("pointerdown", () => {
      this.scene.start("MainMenu");
    });

    EventBus.emit("current-scene-ready", this);
  }
}
