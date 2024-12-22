import Sprite = Phaser.GameObjects.Sprite;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import Container = Phaser.GameObjects.Container;
import Phaser, { Scene } from "phaser";

class PlusMinusIcon extends Container {
  private minus: boolean;
  private bulk: boolean;
  private readonly white: boolean;
  private readonly mainIcon: Sprite;
  private readonly secondIcon: Sprite;
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
    super(scene, x, y);
    this.scene.add.existing(this);
    this.minus = minus;
    this.bulk = bulk;
    this.white = white;
    this.mainIcon = this.scene.add.sprite(0, 0, "ui-icons");
    this.secondIcon = this.scene.add
      .sprite(this.bulkIconOffset.x, this.bulkIconOffset.y, "ui-icons")
      .setVisible(false);
    this.add(this.mainIcon).add(this.secondIcon);
    this.setSize(32, 32);
    this.setScale(0.8);
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
    this.mainIcon.setScale(this.scaleX, this.scaleY);
    this.secondIcon.setScale(
      this.scaleX * this.bulkIconScale,
      this.scaleY * this.bulkIconScale,
    );
    return this;
  }

  private render() {
    const colorSuffix = this.white ? "-white" : "-black";
    const frame = (this.minus ? "minus" : "plus") + colorSuffix;
    this.mainIcon.setFrame(frame);
    this.secondIcon.setFrame(frame);
    this.secondIcon.setVisible(this.bulk);
  }
}

export default PlusMinusIcon;
