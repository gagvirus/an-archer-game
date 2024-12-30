import { Scene } from "phaser";
import { ISceneLifecycle } from "../ISceneLifecycle.ts";

class PlaygroundScene extends Scene implements ISceneLifecycle {
  constructor() {
    super("PlaygroundScene");
  }

  create() {
    console.log("xx");
  }
}

export default PlaygroundScene;
