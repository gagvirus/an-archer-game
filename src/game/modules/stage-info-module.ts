import {createText} from "../helpers/text-helpers.ts";
import {AbstractModule} from "./module-manager.ts";
import MainScene from "../scenes/MainScene.ts";

class StageInfoModule extends AbstractModule {
  private stageNumberText?: Phaser.GameObjects.Text;
  private enemiesText?: Phaser.GameObjects.Text;

  constructor(scene: MainScene) {
    super(scene);
  }

  start() {
    if (!this.stageNumberText) {
      this.stageNumberText = createText(this.scene, "Stage 1", {
        x: 300,
        y: 25,
      }, 16)
      this.enemiesText = createText(this.scene, "Enemies 0 / 0", {
        x: 300,
        y: 50,
      }, 16)
    }
  }

  stop() {
    if (this.stageNumberText) {
      this.stageNumberText.destroy();
      this.stageNumberText = undefined;
    }
    if (this.enemiesText) {
      this.enemiesText.destroy();
      this.enemiesText = undefined;
    }
  }

  update() {
    const scene = this.scene as MainScene;
    if (this.stageNumberText) {
      this.stageNumberText.setText(`Stage ${scene.stage}`);
    }
    if (this.enemiesText) {
      this.enemiesText.setText(`Enemies ${scene.enemies.getLength()} / ${scene.enemiesForStage}`);
    }
  }
}

export default StageInfoModule;
