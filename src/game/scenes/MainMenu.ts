import { Scene } from "phaser";

import { EventBus } from "../EventBus";
import { createCenteredText } from "../helpers/text-helpers.ts";
import { ISceneLifecycle } from "../ISceneLifecycle.ts";

export class MainMenu extends Scene implements ISceneLifecycle {
  constructor() {
    super("MainMenu");
  }

  create() {
    createCenteredText(this, "Main Menu", -300, 38, false);
    createCenteredText(this, "Start Game", -100, 32, true).on(
      "pointerdown",
      () => {
        this.scene.start("MainScene");
      },
    );
    createCenteredText(this, "Hero Select", 100, 32, true).on(
      "pointerdown",
      () => {
        this.scene.start("HeroSelectScene");
      },
    );
    createCenteredText(this, "Settings", 200, 32, true).on(
      "pointerdown",
      () => {
        this.scene.start("SettingsScene");
      },
    );

    createCenteredText(this, "Statistics", 300, 32, true).on(
      "pointerdown",
      () => {
        this.scene.start("StatisticsScene");
      },
    );

    EventBus.emit("current-scene-ready", this);
  }
}
