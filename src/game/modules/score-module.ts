import { createText, formatNumber } from "../helpers/text-helpers.ts";
import { AbstractModule } from "./module-manager.ts";
import { getScore } from "../helpers/accessors.ts";

class ScoreModule extends AbstractModule {
  private scoreText?: Phaser.GameObjects.Text;

  start() {
    if (!this.scoreText) {
      this.scoreText = createText(
        this.scene,
        "Score: 0",
        {
          x: this.scene.scale.width - 50,
          y: 80,
        },
        16,
      );
    }
  }

  stop() {
    if (this.scoreText) {
      this.scoreText.destroy();
      this.scoreText = undefined;
    }
  }

  update() {
    if (this.scoreText) {
      const score = getScore();
      if (score) {
        this.scoreText.setText(`Score: ${formatNumber(score)}`);
      }
    }
  }
}

export default ScoreModule;
