import {Scene} from "phaser";
import StatsManager, {IAttribute, ICoreStat} from "../../helpers/stats-manager.ts";
import {createText} from "../../helpers/text-helpers.ts";
import {VectorZeroes} from "../../helpers/position-helper.ts";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import StatsCirclePartial from "./StatsCirclePartial.ts";

export class StatsScene extends Scene {
  coreStats: ICoreStat[];
  attributes: IAttribute[];
  statsManager: StatsManager;
  unallocatedStatsNumberText: Phaser.GameObjects.Text;
  allocatedStatsNumberText: Phaser.GameObjects.Text[] = [];
  private wrapper: Sizer;
  private statsCircleRenderer: StatsCirclePartial;

  constructor() {
    super("StatsScene");
    this.coreStats = StatsManager.listCoreStats();
    this.attributes = StatsManager.listAttributes();
  }

  init(data: { statsManager: StatsManager }) {
    this.statsManager = data.statsManager;
  }

  create() {
    this.registerKeyListeners();
    const parentWidth = this.scale.width / 2 - 40;

    this.wrapper = this.rexUI.add.sizer({
      x: this.scale.width / 2,
      y: this.scale.height / 2,
      width: parentWidth,
      height: this.scale.height - 40,
      orientation: "horizontal",
    });
    this.statsCircleRenderer = new StatsCirclePartial(this, this.coreStats);
    this.statsCircleRenderer.create();

    this.wrapper
      .add(this.createChildStatsColumn())
      .add(this.createAttributesColumn())
      .layout();

    this.updateUnallocatedStatsNumber(this.statsManager.unallocatedStats);
  }

  private registerKeyListeners() {
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (["Escape", "c", "C"].includes(event.key)) {
        this.scene.resume("MainScene");
        this.scene.stop();
      }
    });
  }

  createChildStatsColumn() {
    const childStatsWrapper = this.rexUI.add.sizer({
      orientation: "vertical",
    });

    childStatsWrapper.add(createText(this, "Child Stats", VectorZeroes()));

    this.coreStats.forEach((coreStat) => {
      coreStat.stats.forEach((stat) => {
        const value = this.statsManager.getChildStat(stat.prop);
        childStatsWrapper.add(createText(this, `${stat.label}: ${value}`, VectorZeroes(), 16, "left", false));
      });
    });

    return childStatsWrapper;
  }

  createAttributesColumn() {
    const attributesWrapper = this.rexUI.add.sizer({
      orientation: "vertical",
    });

    attributesWrapper.add(createText(this, "Attributes", VectorZeroes()));

    this.attributes.forEach((attribute) => {
      const value = parseFloat(this.statsManager.getAttribute(attribute.prop).toFixed(2));
      attributesWrapper.add(createText(this, `${attribute.label}: ${value}`, VectorZeroes(), 16, "left", false));
    });

    return attributesWrapper;
  }

  updateUnallocatedStatsNumber(newNumber: number) {
    this.unallocatedStatsNumberText.setText(newNumber + "");
  }
}
