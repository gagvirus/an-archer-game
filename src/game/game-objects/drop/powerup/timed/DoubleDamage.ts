import MainScene from "../../../../scenes/MainScene.ts";
import TimedPowerup from "./TimedPowerup.ts";
import { PowerupType } from "./powerupType.ts";

class DoubleDamage extends TimedPowerup {
  constructor(scene: MainScene, x: number, y: number) {
    super(scene, x, y, "double-damage");
    this.anims.play("double-damage");
  }

  get powerupType(): PowerupType {
    return PowerupType.DoubleDamage;
  }
}

export default DoubleDamage;
