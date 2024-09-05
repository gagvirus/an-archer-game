import Phaser from 'phaser';

export class Portal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'portal');
        scene.add.existing(this);
        this.anims.play('portal-idle')
    }
}

export default Portal;