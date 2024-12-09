import Phaser, {Scene} from "phaser";

export abstract class Drop extends Phaser.Physics.Arcade.Sprite {
  name: string;
  startedPulling: number;

  protected constructor(scene: Scene, x: number, y: number, name: string) {
    super(scene, x, y, name);
    scene.add.existing(this);

    this.scene.physics.add.existing(this); // Enable physics
    this.body?.setCircle(16); // Adjust size based on your sprite
    this.name = name;
  }

  abstract onCollected(): void;

  setStartedPulling() {
    this.startedPulling = Date.now();
  }
}
