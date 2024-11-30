import Bar from "./Bar.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {COLOR_DANGER, COLOR_SUCCESS} from '../helpers/colors.ts';

class HealthBar extends Bar {
    constructor(scene: Phaser.Scene, position: Vector2Like, width: number, height: number, maxHealth: number, positionOffset?: Vector2Like, displayText: boolean = false) {
        super(scene, position, width, height, maxHealth, maxHealth, positionOffset, COLOR_SUCCESS, COLOR_DANGER, displayText);
    }
}

export default HealthBar;
