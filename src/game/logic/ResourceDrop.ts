import Phaser, {Scene} from "phaser";

export enum ResourceType {
    coin = "coin",
    soul = "soul",
}

export abstract class ResourceDrop extends Phaser.Physics.Arcade.Sprite {
    amount: number;
    resourceName: string;
    startedPulling: number;

    protected constructor(scene: Scene, x: number, y: number, amount: number = 1, name: ResourceType = ResourceType.coin) {
        super(scene, x, y, name);
        scene.add.existing(this);

        this.scene.physics.add.existing(this); // Enable physics
        this.body?.setCircle(16); // Adjust size based on your sprite
        this.amount = amount;
        this.resourceName = name;
    }

    setStartedPulling() {
        this.startedPulling = Date.now();
    }
}
