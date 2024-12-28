import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import { Renderable } from "../../helpers/ui-helper.ts";
import {
  HEX_COLOR_DARK,
  HEX_COLOR_LIGHT,
  HEX_COLOR_LIGHT_GREY,
} from "../../helpers/colors.ts";
import { Scene } from "phaser";
import { createText, formatNumber } from "../../helpers/text-helpers.ts";
import { VectorZeroes } from "../../helpers/position-helper.ts";
import { ResourceType } from "../../logic/drop/resource/Resource.ts";
import { getStatistic } from "../../helpers/accessors.ts";

class GameStatisticsPartial implements Renderable {
  private readonly scene: Phaser.Scene;
  private readonly width: number;
  private readonly height: number;
  private global: boolean;

  constructor(
    scene: Scene,
    width: number,
    height: number,
    global: boolean = false,
  ) {
    this.width = width;
    this.height = height;
    this.scene = scene;
    this.global = global;
  }
  render(container: Sizer) {
    const panel = this.scene.rexUI.add.scrollablePanel({
      width: this.width,
      height: this.height,
      scrollMode: "y",
      background: this.scene.rexUI.add.roundRectangle({
        color: HEX_COLOR_LIGHT_GREY,
        alpha: 0.7,
        radius: 10,
      }),
      panel: {
        child: this.createContainer(this.global),
        mask: { padding: 1 },
      },
      slider: {
        track: this.scene.rexUI.add.roundRectangle({
          radius: 5,
          color: HEX_COLOR_DARK,
          alpha: 0.7,
        }),
        thumb: this.scene.rexUI.add.roundRectangle({
          width: 20,
          height: 40,
          radius: 10,
          color: HEX_COLOR_LIGHT,
          alpha: 0.7,
        }),
      },
      mouseWheelScroller: {
        focus: false,
        speed: 0.1,
      },
      header: this.scene.rexUI.add.label({
        space: { left: 5, right: 5, top: 5, bottom: 15 },
        text: createText(this.scene, "Game Statistics", VectorZeroes(), 32),
        align: "center",
      }),
      space: {
        left: 15,
        right: 15,
        top: 15,
        bottom: 15,
        panel: 15,
        header: 15,
        footer: 15,
      },
    });
    container.add(panel).layout();
  }

  private createContainer(global: boolean = false) {
    const container = this.scene.rexUI.add.sizer({
      orientation: "vertical",
    });
    const allResources = Object.values(ResourceType);
    const allStatistics = [
      "levelsPassed",
      "secondsPlayed",
      "leveledUp",
      "damageBlocked",
      "damageReceived",
      "timesHit",
      "timesEvaded",
      "enemiesKilled",
      "damageInflicted",
      "regularHits",
      "criticalHits",
      "xpGained",
      "score",
      ...allResources.map((r) => `resourceCollected.${r}`),
    ];
    allStatistics.forEach((statistic) => {
      const row = this.scene.rexUI.add.sizer({
        orientation: "horizontal",
        width: this.width,
      });
      const fieldText = createText(
        this.scene,
        statistic,
        VectorZeroes(),
        22,
      ).setOrigin(1, 0.5);
      const valueText = createText(
        this.scene,
        formatNumber(getStatistic(statistic, global)),
        VectorZeroes(),
        22,
      ).setOrigin(0, 0.5);
      row.add(fieldText, { proportion: 1 });
      row.add(valueText, { proportion: 1 });
      row.layout();
      container.add(row);
    });
    return container.layout();
  }
}

export default GameStatisticsPartial;
