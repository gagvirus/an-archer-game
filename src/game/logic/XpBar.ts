import Bar from "./Bar.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;

class XpBar extends Bar {
    constructor(scene: Phaser.Scene, position: Vector2Like, width: number, height: number, xpToNextLevel: number, currentXp: number = 0, positionOffset?: Vector2Like) {
        super(scene, position, width, height, xpToNextLevel, currentXp, positionOffset, 0xffff00, 0x808080)
    }
}

export default XpBar;