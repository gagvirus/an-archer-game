import Phaser from 'phaser';
import MainScene from "../scenes/MainScene.ts";

export class Vortex extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: MainScene, x: number, y: number) {
        super(scene, x, y, 'vortex');
        scene.add.existing(this);
        this.anims.play('purple-vortex')
    }
}

export default Vortex;
