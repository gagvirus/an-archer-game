import { Scene } from "phaser";
import { HEX_COLOR_DARK, HEX_COLOR_WHITE } from "../helpers/colors.ts";
import { ISceneLifecycle } from "../ISceneLifecycle.ts";
import { createText } from "../helpers/text-helpers.ts";
import { VectorZeroes } from "../helpers/position-helper.ts";
import StatsManager, {
  IAttribute,
  IChildStat,
  ICoreStat,
} from "../helpers/stats-manager.ts";
import Hero from "../logic/Hero.ts";

export default class StatsMockScene extends Scene implements ISceneLifecycle {
  private coreStats: ICoreStat[];
  private statsManager: StatsManager;
  private attributes: IAttribute[];

  constructor() {
    super({ key: "StatsScene" });
    this.coreStats = StatsManager.listCoreStats();
    this.attributes = StatsManager.listAttributes();
  }

  init(data: { statsManager: StatsManager }) {
    if (data.statsManager) {
      this.statsManager = data.statsManager;
    } else {
      this.statsManager = new StatsManager(this, new Hero(this, -100, -100));
    }
  }

  create() {
    const attributesPanel = this.createAttributesPanel();
    const coreStatsWheelPanel = this.createCoreStatsWheelPanel();
    const statsPanel = this.createStatsPanel();

    // Create a horizontal box layout to arrange panels
    this.rexUI.add
      .sizer({
        x: this.scale.width / 2,
        y: this.scale.height / 2,
        orientation: "x", // Horizontal layout
        space: { item: 20 }, // Space between panels
      })
      .add(attributesPanel, 1, "center", 0, true)
      .add(coreStatsWheelPanel, 1, "center", 0, true)
      .add(statsPanel, 1, "center", 0, true)
      .layout();

    // Debug: Add a back button
    this.add
      .text(this.scale.width - 20, this.scale.height - 20, "Back", {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(1, 1)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("MainMenu")); // Replace 'MainMenu' with your menu scene key
  }

  private createAttributesPanel() {
    const container = this.createContainer(
      "Attributes",
      this.scale.width * 0.9 * 0.3, // 3/10 width of the full screen width minus padding 10%
      this.scale.height - 40, // full height minus padding
    );
    this.attributes.forEach((attribute) => {
      const value = parseFloat(
        this.statsManager.getAttribute(attribute.prop).toFixed(2),
      );
      container.add(
        createText(
          this,
          `${attribute.label}: ${value}`,
          VectorZeroes(),
          16,
          "left",
          false,
        ),
      );
    });
    return container;
  }

  private createCoreStatsWheelPanel() {
    const container = this.createContainer(
      "Core Stats",
      this.scale.width * 0.9 * 0.4, // 4/10 width of the full screen width minus padding 10%
      this.scale.height - 40, // full height minus padding
    );
    console.log(container);
    return container;
  }

  private createStatsPanel() {
    const container = this.createContainer(
      "Stats",
      this.scale.width * 0.9 * 0.3, // 3/10 width of the full screen width minus padding 10%
      this.scale.height - 40, // full height minus padding
    );
    this.coreStats.forEach((coreStat) => {
      coreStat.stats.forEach((stat) => {
        container.add(this.renderStatRow(stat));
      });
    });
    return container;
  }

  private renderStatRow(stat: IChildStat) {
    const value = this.statsManager.getChildStat(stat.prop);

    // Create a horizontal sizer for the row
    const rowSizer = this.rexUI.add.sizer({
      orientation: "x", // Horizontal layout
      space: { item: 10 }, // Space between columns
    });

    // Icon column
    const icon = this.add
      // todo: actual icon
      .image(0, 0, "icons", stat.icon ?? "danger")
      .setDisplaySize(32, 32) // Adjust size as needed
      .setOrigin(0, 0.5); // Align vertically center
    rowSizer.add(icon, 0, "center", 0, false);

    // Label column
    const label = this.add
      .text(0, 0, stat.label, {
        fontSize: "18px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5); // Align vertically center
    rowSizer.add(label, 1, "center", 0, false); // Flexible width for the label

    // Value column
    const valueText = this.add
      .text(0, 0, parseFloat(value.toFixed(2)).toString(), {
        fontSize: "18px",
        color: "#ffffff",
      })
      .setOrigin(1, 0.5); // Align vertically center and right-align text
    rowSizer.add(valueText, 0, "center", 0, false);

    // Layout the row
    rowSizer.layout();

    return rowSizer;
  }

  private createContainer(title: string, width: number, height: number) {
    // Create a panel container with background and title text
    const container = this.rexUI.add.sizer({
      width,
      height,
      orientation: "vertical",
    });
    container.addBackground(
      this.rexUI.add
        .roundRectangle(0, 0, 0, 0, 10, HEX_COLOR_DARK)
        .setStrokeStyle(2, HEX_COLOR_WHITE),
    );
    const titleText = createText(this, title, VectorZeroes(), 20);
    container.add(titleText, {
      padding: {
        top: 10,
        bottom: 10,
      },
    });

    container.layout();

    return container;
  }
}
