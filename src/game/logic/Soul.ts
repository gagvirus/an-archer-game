import Phaser, {Scene} from "phaser";

export class Soul extends Phaser.Physics.Arcade.Sprite {
    amount: number;
    constructor(scene: Scene, x: number, y: number, amount: number = 1) {
        super(scene, x, y, 'soul');
        scene.add.existing(this);

        this.scene.physics.add.existing(this); // Enable physics
        this.body?.setCircle(16); // Adjust size based on your sprite
        this.amount = amount;

        this.anims.play('purple_flame')
    }
}
