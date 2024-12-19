import { Renderable } from "../../helpers/ui-helper.ts";
import { Scene } from "phaser";
import StatsManager, {
  IChildStat,
  ICoreStat,
} from "../../helpers/stats-manager.ts";
import { HEX_COLOR_DARK, HEX_COLOR_WHITE } from "../../helpers/colors.ts";
import { createText } from "../../helpers/text-helpers.ts";
import { VectorZeroes } from "../../helpers/position-helper.ts";
import Tooltip from "../../ui/tooltip.ts";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";

class StatsCirclePartial implements Renderable {
  private coreStats: ICoreStat[];
  private readonly scene: Phaser.Scene;
  private statsManager: StatsManager;
  private tooltip: Tooltip;
  private readonly width: number;

  constructor(scene: Scene, width: number, statsManager: StatsManager) {
    this.scene = scene;
    this.width = width;
    this.statsManager = statsManager;
    this.coreStats = StatsManager.listCoreStats();
    this.tooltip = new Tooltip(this.scene, 0, 0, "");
  }

  render(container: Sizer) {
    this.coreStats.forEach((coreStat) => {
      coreStat.stats.forEach((stat) => {
        container.add(this.renderStatRow(stat, this.width - 40));
      });
    });
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
    const rowBackground = this.scene.rexUI.add
      .roundRectangle(0, 0, rowWidth, rowHeight, 10, HEX_COLOR_DARK)
      .setStrokeStyle(2, HEX_COLOR_WHITE);

    // Create a horizontal sizer for the row
    const rowSizer = this.scene.rexUI.add
      .sizer({
        orientation: "x", // Horizontal layout
        width: rowWidth, // Fixed row width
        height: rowHeight, // Fixed row height
        space: { left: rowPadding, right: rowPadding }, // Padding inside the row
      })
      .addBackground(rowBackground);

    // Icon column (fixed width)
    const icon = this.scene.add
      .sprite(0, 0, "icons", stat.icon ?? "danger")
      .setDisplaySize(iconWidth - 10, iconWidth - 10) // Adjust icon size
      .setOrigin(0, 0.5) // Align left and vertically center

      .setInteractive()
      .on("pointerover", () => {
        if (stat.description) {
          this.tooltip.show(stat.description);
        }
      })
      .on("pointerout", () => {
        this.tooltip.hide();
      });
    rowSizer.add(icon, 0, "left", { right: 10 }, false);

    // Label column (80% of remaining space)
    const label = createText(
      this.scene,
      stat.label,
      VectorZeroes(),
      18,
    ).setOrigin(0, 0.5);
    rowSizer.add(label, labelWidthRatio, "left", { right: 10 }, true);

    // Value column (remaining space, right-aligned)
    const valueText = createText(
      this.scene,
      value,
      VectorZeroes(),
      18,
    ).setOrigin(1, 0.5);
    rowSizer.add(valueText, valueWidthRatio, "right", 0, false);

    // Layout the row
    rowSizer.layout();

    return rowSizer;
  }
}

export default StatsCirclePartial;
