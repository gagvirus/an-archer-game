import {Scene} from "phaser";
import {ResourceDrop, ResourceType} from "./ResourceDrop.ts";

export class Soul extends ResourceDrop {
    constructor(scene: Scene, x: number, y: number, amount: number = 1) {
        super(scene, x, y, amount, ResourceType.soul);
        this.anims.play("purple_flame")
    }
}
