import Phaser, {Scene} from "phaser";
import Rectangle = Phaser.GameObjects.Rectangle;
import {isDebugMode} from "../helpers/debug-helper.ts";

export class Tower extends Phaser.Physics.Arcade.Sprite {
    outline?: Rectangle;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'towers', 0);
        scene.add.existing(this);
        this.outline = scene.add.rectangle(this.x, this.y, this.width, this.height, 0xffff00, 0.3);
        this.outline.setVisible(isDebugMode(scene.game));
    }

    update() {
        this.outline?.setPosition(this.x, this.y);
    }

    setScale(x?: number, y?: number): this {
        super.setScale(x, y);
        this.outline?.setScale(this.scale);
        return this;
    }
}

export default Tower;