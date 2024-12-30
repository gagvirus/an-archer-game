import { Scene } from "phaser";
import { ISceneLifecycle } from "../ISceneLifecycle.ts";
import { createCursorKeys } from "../helpers/keyboard-helper.ts";
import Hero from "../logic/Hero.ts";

class PlaygroundScene extends Scene implements ISceneLifecycle {
  private hero: Hero;
  constructor() {
    super("PlaygroundScene");
  }

  create() {
    // Initialize the hero in the center of the canvas
    this.hero = new Hero(this, this.scale.width / 2, this.scale.height / 2);
  }

  update(time: number, delta: number) {
    const cursors = createCursorKeys(this);
    this.hero.update(cursors, time, delta);
  }
}

export default PlaygroundScene;
