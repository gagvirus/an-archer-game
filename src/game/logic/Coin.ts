import Phaser, {Scene} from "phaser";

export class Coin extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'coin');
        scene.add.existing(this);
        this.anims.play('coin')
        this.scale = 0.5;
    }
}
