import MainScene from "../scenes/MainScene.ts";
import {Powerup} from "./Powerup.ts";

class Magnet extends Powerup {
    onCollected(): void {
      const scene = this.scene as MainScene;
      scene.magnetEffect();
    }
    constructor(scene: MainScene, x: number, y: number) {
        super(scene, x, y, 'magnet');
        scene.add.existing(this);
        this.anims.play('purple-vortex')
    }
}

export default Magnet;