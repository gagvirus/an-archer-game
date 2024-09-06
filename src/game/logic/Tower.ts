import Phaser, {Scene} from "phaser";

export class Tower extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'towers', 0);
        scene.add.existing(this);
    }
}

export default Tower;
