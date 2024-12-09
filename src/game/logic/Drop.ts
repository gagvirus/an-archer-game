import Phaser, {Scene} from "phaser";
import {ResourceType} from "./Resource.ts";

export abstract class Drop extends Phaser.Physics.Arcade.Sprite {
  name: string;
  startedPulling: number;

  protected constructor(scene: Scene, x: number, y: number, name: ResourceType = ResourceType.coin) {
    super(scene, x, y, name);
    scene.add.existing(this);

    this.scene.physics.add.existing(this); // Enable physics
    this.body?.setCircle(16); // Adjust size based on your sprite
    this.name = name;
  }

  setStartedPulling() {
    this.startedPulling = Date.now();
  }
}
