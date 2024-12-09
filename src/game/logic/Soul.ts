import {Scene} from "phaser";
import {Resource, ResourceType} from "./drop/resource/Resource.ts";

export class Soul extends Resource {
  constructor(scene: Scene, x: number, y: number, amount: number = 1) {
    super(scene, x, y, amount, ResourceType.soul);
    this.anims.play("soul")
  }
}
