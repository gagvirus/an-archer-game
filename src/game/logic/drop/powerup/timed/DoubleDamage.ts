import MainScene from "../../../../scenes/MainScene.ts";
import TimedPowerup from "./TimedPowerup.ts";
import { PowerupType } from "./powerupType.ts";

class DoubleDamage extends TimedPowerup {
  get powerupType(): PowerupType {
    return PowerupType.DoubleDamage;
  }

  constructor(scene: MainScene, x: number, y: number) {
    super(scene, x, y, "double-damage");
    this.anims.play("double-damage");
  }
}

export default DoubleDamage;
