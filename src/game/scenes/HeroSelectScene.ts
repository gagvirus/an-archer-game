import { Scene } from "phaser";
import { EventBus } from "../EventBus.ts";
import { ISceneLifecycle } from "../ISceneLifecycle.ts";

class HeroSelectScene extends Scene implements ISceneLifecycle {
  constructor() {
    super("HeroSelectScene");
  }

  create() {
    EventBus.emit("current-scene-ready", this);
  }
}

export default HeroSelectScene;
