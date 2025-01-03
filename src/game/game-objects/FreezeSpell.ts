import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import { Attackable } from "../helpers/gameplayer-helper.ts";
import Container = Phaser.GameObjects.Container;

class FreezeSpell extends Container {
  private owner: Attackable;
  constructor(scene: AbstractGameplayScene, owner: Attackable) {
    const { x, y } = owner.owner;
    super(scene, x, y);
    this.owner = owner;
    scene.add.existing(this);

    const sphereRadius = 250;

    const sphere = scene.physics.add.existing(
      scene.add.circle(0, 0, sphereRadius, 0x0000cc, 0.2),
    );

    this.add(sphere);
  }
  update() {
    this.setPosition(this.owner.owner.x, this.owner.owner.y);
  }
}

export default FreezeSpell;
