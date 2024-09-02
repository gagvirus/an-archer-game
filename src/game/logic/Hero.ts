import Phaser from "phaser";
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

class Hero extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'hero');  // 'hero' is the key for the hero sprite
        scene.add.existing(this);     // Add the hero to the scene
        scene.physics.add.existing(this); // Enable physics for the hero
        this.setCollideWorldBounds(true); // Prevent the hero from moving offscreen

        // initial state
        this.state = 'idle';
    }

    // Method to update the hero's animation based on movement
    update(cursors: CursorKeys) {
        if (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown) {
            if (this.state !== 'run') {
                this.state = 'run';
                this.anims.play('run', true);
            }
        } else {
            if (this.state !== 'idle') {
                this.state = 'idle';
                this.anims.play('idle', true);
            }
        }
    }
}


export default Hero;