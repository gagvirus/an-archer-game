import MainScene from "../../../../scenes/MainScene.ts";
import TimedPowerup from "./TimedPowerup.ts";
import { PowerupType } from "./powerupType.ts";

class DoubleSpeed extends TimedPowerup {
  constructor(scene: MainScene, x: number, y: number) {
    super(scene, x, y, "double-speed");
    this.anims.play("double-speed");
  }

  get powerupType(): PowerupType {
    return PowerupType.DoubleSpeed;
  }
}

export default DoubleSpeed;
