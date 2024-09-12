import Bar from "./Bar.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {COLOR_GREY, COLOR_WARNING} from '../helpers/colors.ts';

class XpBar extends Bar {
    constructor(scene: Phaser.Scene, position: Vector2Like, width: number, height: number, xpToNextLevel: number, currentXp: number = 0, positionOffset?: Vector2Like) {
        super(scene, position, width, height, xpToNextLevel, currentXp, positionOffset, COLOR_WARNING, COLOR_GREY)
    }
}

export default XpBar;
