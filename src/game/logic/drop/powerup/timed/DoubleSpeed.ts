import MainScene from "../../../../scenes/MainScene.ts";
import TimedPowerup from "./TimedPowerup.ts";
import { PowerupType } from "./powerupType.ts";

class DoubleSpeed extends TimedPowerup {
  get powerupType(): PowerupType {
    return PowerupType.DoubleSpeed;
  }

  constructor(scene: MainScene, x: number, y: number) {
    super(scene, x, y, "double-speed");
    this.anims.play("double-speed");
  }
}

export default DoubleSpeed;
