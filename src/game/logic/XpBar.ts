import {Vector2} from "../helpers/position-helper.ts";
import Bar from "./Bar.ts";

class XpBar extends Bar {
    constructor(scene: Phaser.Scene, position: Vector2, width: number, height: number, xpToNextLevel: number, currentXp: number = 0, positionOffset?: Vector2) {
        super(scene, position, width, height, xpToNextLevel, currentXp, positionOffset, 0xffff00, 0x808080)
    }
}

export default XpBar;