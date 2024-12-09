import MainScene from "../scenes/MainScene.ts";
import {Powerup} from "./Powerup.ts";

class DoubleDamage extends Powerup {
  onCollected(): void {
    console.log('double damage');
  }

  constructor(scene: MainScene, x: number, y: number) {
    super(scene, x, y, 'double-damage');
    scene.add.existing(this);
    this.anims.play('double-damage')
  }
}

export default DoubleDamage;
