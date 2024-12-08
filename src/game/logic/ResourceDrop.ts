import Phaser, {Scene} from "phaser";

export abstract class ResourceDrop extends Phaser.Physics.Arcade.Sprite {
    amount: number;
    resourceName: string;

    constructor(scene: Scene, x: number, y: number, amount: number = 1, name: string = "resource-drop") {
        super(scene, x, y, name);
        scene.add.existing(this);

        this.scene.physics.add.existing(this); // Enable physics
        this.body?.setCircle(16); // Adjust size based on your sprite
        this.amount = amount;
        this.resourceName = name;
    }
}
