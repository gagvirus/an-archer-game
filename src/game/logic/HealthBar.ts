import Bar from "./Bar.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;

class HealthBar extends Bar {
    constructor(scene: Phaser.Scene, position: Vector2Like, width: number, height: number, maxHealth: number, positionOffset?: Vector2Like) {
        super(scene, position, width, height, maxHealth, maxHealth, positionOffset)
    }
}

export default HealthBar;