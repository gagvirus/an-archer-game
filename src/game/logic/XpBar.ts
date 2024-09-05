import {Vector2} from "../helpers/position-helper.ts";
import Bar from "./Bar.ts";

class XpBar extends Bar {
    constructor(scene: Phaser.Scene, position: Vector2, width: number, height: number, maxHealth: number, positionOffset?: Vector2) {
        super(scene, position, width, height, maxHealth, positionOffset, 0xffff00, 0x808080)
    }
}

export default XpBar;