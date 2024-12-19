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
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import UiHelper from "../helpers/ui-helper.ts";
import Tooltip from "../ui/tooltip.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;
import StatsCirclePartial from "./StatsScene/StatsCirclePartial.ts";

export default class StatsMockScene extends Scene implements ISceneLifecycle {
  private coreStats: ICoreStat[];
  private statsManager: StatsManager;
  private attributes: IAttribute[];
  private tooltip: Tooltip;
  private mousePosition: Vector2Like;
  private fullWidth: number = 1200;

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
    if (this.scale.width > 1280) {
      this.fullWidth = this.scale.width * 0.9;
      if (this.scale.width > 1600) {
        this.fullWidth = this.scale.width * 0.8;
        if (this.scale.width > 1900) {
          this.fullWidth = this.scale.width * 0.7;
        }
      }
    }
    this.tooltip = new Tooltip(this, 0, 0, "");

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.mousePosition = { x: pointer.x, y: pointer.y };
    });

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
    const width = this.fullWidth * 0.3;
    const height = this.scale.height * 0.7;

    const container = this.rexUI.add.sizer({
      orientation: "vertical",
      space: { item: 10 },
    });
    const titleText = createText(this, "Attributes", VectorZeroes(), 20);
    container.add(titleText, {
      padding: {
        bottom: 10,
      },
    });
    const scrollableConfig: ScrollablePanel.IConfig = {
      x: 0,
      y: 0,
      width,
      height,
      scrollMode: "vertical",
      background: this.rexUI.add
        .roundRectangle(0, 0, 0, 0, 10, HEX_COLOR_DARK)
        .setStrokeStyle(2, HEX_COLOR_WHITE),

      panel: {
        child: container,

        mask: {
          padding: 1,
        },
      },

      slider: UiHelper.getDefaultSliderConfig(this),
      space: { left: 10, right: 10, top: 10, bottom: 10, panel: 10 },
    };
    const panel = this.rexUI.add.scrollablePanel(scrollableConfig);

    panel.layout();

    this.attributes.forEach((attribute) => {
      container.add(this.renderAttributeRow(attribute, width - 40));
    });
    return panel;
  }

  private renderAttributeRow(attribute: IAttribute, rowWidth: number) {
    const value = parseFloat(
      this.statsManager.getAttribute(attribute.prop).toFixed(2),
    ).toString();
    const rowHeight = 30;
    const iconWidth = 50; // Fixed width for the icon column
    const labelWidthRatio = 0.8; // 80% of remaining width
    const valueWidthRatio = 1 - labelWidthRatio; // Remaining width for value column
    const rowPadding = 5;

    // Row background with border
    const rowBackground = this.rexUI.add
      .roundRectangle(0, 0, rowWidth, rowHeight, 10, HEX_COLOR_DARK)
      .setStrokeStyle(2, HEX_COLOR_WHITE);

    // Create a horizontal sizer for the row
    const rowSizer = this.rexUI.add
      .sizer({
        orientation: "x", // Horizontal layout
        width: rowWidth, // Fixed row width
        height: rowHeight, // Fixed row height
        space: { left: rowPadding, right: rowPadding }, // Padding inside the row
      })
      .addBackground(rowBackground);

    // Icon column (fixed width)
    const icon = this.add
      .sprite(0, 0, "icons", attribute.icon ?? "danger")
      .setDisplaySize(iconWidth - 10, iconWidth - 10) // Adjust icon size
      .setOrigin(0, 0.5); // Align left and vertically center
    rowSizer.add(icon, 0, "left", { right: 10 }, false);

    // Label column (80% of remaining space)
    const label = createText(
      this,
      attribute.label,
      VectorZeroes(),
      14,
    ).setOrigin(0, 0.5);
    rowSizer.add(label, labelWidthRatio, "left", { right: 10 }, true);

    // Value column (remaining space, right-aligned)
    const valueText = createText(this, value, VectorZeroes(), 14).setOrigin(
      1,
      0.5,
    );
    rowSizer.add(valueText, valueWidthRatio, "right", 0, false);

    // Layout the row
    rowSizer.layout();

    return rowSizer;
  }

  private createCoreStatsWheelPanel() {
    const container = this.createContainer(
      "Core Stats",
      this.fullWidth * 0.4, // 4/10 width of the full screen width minus padding 10%
      this.scale.height * 0.7, // full height minus padding
    );

    const statsCircleRenderer = new StatsCirclePartial(
      this,
      this.coreStats,
      this.statsManager,
      {
        x: this.scale.width / 2 + this.scale.width * 0,
        y: this.scale.height / 2,
      },
    );
    statsCircleRenderer.create();

    return container;
  }

  private createStatsPanel() {
    const width = this.fullWidth * 0.3;
    const container = this.createContainer(
      "Stats",
      width, // 3/10 width of the full screen width minus padding 10%
      this.scale.height * 0.7, // full height minus padding
    );
    this.coreStats.forEach((coreStat) => {
      coreStat.stats.forEach((stat) => {
        container.add(this.renderStatRow(stat, width - 40));
      });
    });
    return container;
  }

  private renderStatRow(stat: IChildStat, rowWidth: number) {
    const value = parseFloat(
      this.statsManager.getChildStat(stat.prop).toFixed(2),
    ).toString();

    const rowHeight = 50;
    const iconWidth = 50; // Fixed width for the icon column
    const labelWidthRatio = 0.8; // 80% of remaining width
    const valueWidthRatio = 1 - labelWidthRatio; // Remaining width for value column
    const rowPadding = 10;

    // Row background with border
    const rowBackground = this.rexUI.add
      .roundRectangle(0, 0, rowWidth, rowHeight, 10, HEX_COLOR_DARK)
      .setStrokeStyle(2, HEX_COLOR_WHITE);

    // Create a horizontal sizer for the row
    const rowSizer = this.rexUI.add
      .sizer({
        orientation: "x", // Horizontal layout
        width: rowWidth, // Fixed row width
        height: rowHeight, // Fixed row height
        space: { left: rowPadding, right: rowPadding }, // Padding inside the row
      })
      .addBackground(rowBackground);

    // Icon column (fixed width)
    const icon = this.add
      .sprite(0, 0, "icons", stat.icon ?? "danger")
      .setDisplaySize(iconWidth - 10, iconWidth - 10) // Adjust icon size
      .setOrigin(0, 0.5) // Align left and vertically center

      .setInteractive()
      .on("pointerover", () => {
        if (stat.description) {
          this.tooltip.show(this.mousePosition, stat.description);
        }
      })
      .on("pointerout", () => {
        this.tooltip.hide();
      });
    rowSizer.add(icon, 0, "left", { right: 10 }, false);

    // Label column (80% of remaining space)
    const label = createText(this, stat.label, VectorZeroes(), 18).setOrigin(
      0,
      0.5,
    );
    rowSizer.add(label, labelWidthRatio, "left", { right: 10 }, true);

    // Value column (remaining space, right-aligned)
    const valueText = createText(this, value, VectorZeroes(), 18).setOrigin(
      1,
      0.5,
    );
    rowSizer.add(valueText, valueWidthRatio, "right", 0, false);

    // Layout the row
    rowSizer.layout();

    return rowSizer;
  }

  private createContainer(
    title: string,
    width: number,
    height: number,
    rowSpacing: number = 10,
  ) {
    // Create a panel container with background and title text
    const container = this.rexUI.add.sizer({
      width,
      height,
      orientation: "vertical",
      space: { item: rowSpacing, bottom: rowSpacing * 2 },
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
