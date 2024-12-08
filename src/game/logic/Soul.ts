import {Scene} from "phaser";
import {ResourceDrop} from "./ResourceDrop.ts";

export class Soul extends ResourceDrop {
    constructor(scene: Scene, x: number, y: number, amount: number = 1) {
        super(scene, x, y, amount, "soul");
        this.anims.play("purple_flame")
    }
}
