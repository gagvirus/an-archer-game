import Bar from "./Bar.ts";
import { HEX_COLOR_DANGER, HEX_COLOR_SUCCESS } from "../helpers/colors.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;

class HealthBar extends Bar {
  constructor(
    scene: Phaser.Scene,
    position: Vector2Like,
    width: number,
    height: number,
    maxHealth: number,
    positionOffset?: Vector2Like,
    displayText: boolean = false,
  ) {
    super(
      scene,
      position,
      width,
      height,
      maxHealth,
      maxHealth,
      positionOffset,
      HEX_COLOR_SUCCESS,
      HEX_COLOR_DANGER,
      displayText,
    );
  }
}

export default HealthBar;
