import Sprite = Phaser.GameObjects.Sprite;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import { Scene } from "phaser";

class PlusMinusIcon extends Sprite {
  private minus: boolean;
  private bulk: boolean;
  private white: boolean;
  private bulkIcon: Sprite;
  private readonly bulkIconScale: number = 0.85;
  private readonly bulkIconOffset: Vector2Like = { x: 5, y: -5 };

  constructor(
    scene: Scene,
    x: number,
    y: number,
    white: boolean = false,
    minus: boolean = false,
    bulk: boolean = false,
  ) {
    super(scene, x, y, "ui-icons");
    this.scene.add.existing(this);
    this.minus = minus;
    this.bulk = bulk;
    this.white = white;
    this.bulkIcon = this.scene.add
      .sprite(x + this.bulkIconOffset.x, y + this.bulkIconOffset.y, "ui-icons")
      .setVisible(false);
    this.render();
  }

  public setMinus(minus: boolean) {
    this.minus = minus;
    this.render();
    return this;
  }

  public setBulk(bulk: boolean) {
    this.bulk = bulk;
    this.render();
    return this;
  }

  public setScale(x?: number, y?: number) {
    super.setScale(x, y);
    this.bulkIcon.setScale(
      this.scaleX * this.bulkIconScale,
      this.scaleY * this.bulkIconScale,
    );
    return this;
  }

  private render() {
    const colorSuffix = this.white ? "-white" : "-black";
    const frame = (this.minus ? "minus" : "plus") + colorSuffix;
    this.setFrame(frame);
    this.bulkIcon.setFrame(frame);
    this.bulkIcon.setVisible(this.bulk);
  }
}

export default PlusMinusIcon;
