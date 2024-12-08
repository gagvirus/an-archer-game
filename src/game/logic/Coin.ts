import {Scene} from "phaser";
import {ResourceDrop} from "./ResourceDrop.ts";

export class Coin extends ResourceDrop {
    constructor(scene: Scene, x: number, y: number, amount: number = 1) {
        super(scene, x, y, amount, "coin");
        this.anims.play("coin")
        this.scale = 0.5;
    }
}
