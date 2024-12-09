import {Scene} from "phaser";
import {Drop} from "./Drop.ts";

export enum ResourceType {
  coin = "coin",
  soul = "soul",
}

export abstract class Resource extends Drop {
  amount: number;

  protected constructor(scene: Scene, x: number, y: number, amount: number = 1, name: ResourceType = ResourceType.coin) {
    super(scene, x, y, name);
    this.amount = amount;
  }
}
