import MainScene from "../scenes/MainScene.ts";
import {Powerup} from "./Powerup.ts";

class DoubleDamage extends Powerup {
  durationSeconds: number;

  onCollected(): void {
    const scene = this.scene as MainScene;
    scene.events.emit('powerupCollected');
    scene.hero.extra.multiplyDamage(2);
    setTimeout(() => {
      scene.hero.extra.multiplyDamage(1 / 2);
      scene.events.emit('powerupEnded');
    }, this.durationSeconds * 1000);
  }

  constructor(scene: MainScene, x: number, y: number, durationSeconds: number = 30) {
    super(scene, x, y, 'double-damage');
    scene.add.existing(this);
    this.anims.play('double-damage')
    this.durationSeconds = durationSeconds;
  }
}

export default DoubleDamage;
