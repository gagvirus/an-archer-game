import { Scene } from "phaser";
import { ISceneLifecycle } from "./contracts/ISceneLifecycle.ts";
import { createCursorKeys } from "../helpers/keyboard-helper.ts";
import Hero from "../game-objects/Hero.ts";

class PlaygroundScene extends Scene implements ISceneLifecycle {
  private hero: Hero;
  constructor() {
    super("PlaygroundScene");
  }

  create() {
    // Initialize the hero in the center of the canvas
    this.hero = new Hero(this, this.scale.width / 2, this.scale.height / 2);
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (["1", "2"].includes(event.key)) {
        const skillsMap = {
          "1": "freeze",
          "2": "barrage",
        };
        console.log(skillsMap[event.key as "1" | "2"]);
      }
    });
  }

  update(time: number, delta: number) {
    const cursors = createCursorKeys(this);
    this.hero.update(cursors, time, delta);
  }
}

export default PlaygroundScene;
