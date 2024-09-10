import Phaser, {Scene} from "phaser";
import Rectangle = Phaser.GameObjects.Rectangle;
import {isDebugMode} from "../helpers/registry-helper.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {TILE_SIZE} from "../helpers/position-helper.ts";

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
    
    setVisible(value: boolean): this {
        super.setVisible(value);
        this.outline?.setVisible(value);
        return this;
    }
    
    destroy(fromScene?: boolean) {
        super.destroy(fromScene);
        this.outline?.destroy();
    }
    
    clone(scene?: Scene)
    {
        const clone = new Tower(scene ?? this.scene, this.x, this.y);
        clone.setScale(this.scale);
        return clone;
    }

    getOccupyingCoordinates(): Vector2Like
    {
        return {x: (this.x - TILE_SIZE / 2) / TILE_SIZE, y: this.y / TILE_SIZE};
    }
}

export default Tower;
