import { Renderable } from "../../helpers/ui-helper.ts";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import StatsManager, { IAttribute } from "../../helpers/stats-manager.ts";
import { HEX_COLOR_DARK, HEX_COLOR_WHITE } from "../../helpers/colors.ts";
import { createText } from "../../helpers/text-helpers.ts";
import { VectorZeroes } from "../../helpers/position-helper.ts";
import { Scene } from "phaser";
import { StatType } from "../../helpers/stats.ts";

class AttributesPartial implements Renderable {
  private scene: Phaser.Scene;
  private readonly width: number;
  private statsManager: StatsManager;
  private attributes: Record<StatType, IAttribute[]>;
  constructor(scene: Scene, width: number, statsManager: StatsManager) {
    this.scene = scene;
    this.width = width;
    this.statsManager = statsManager;
    this.attributes = StatsManager.listAttributes();
  }

  render(container: Sizer) {
    Object.keys(this.attributes).forEach((statType) => {
      this.attributes[statType as StatType].forEach((attribute) => {
        container.add(this.renderAttributeRow(attribute, this.width - 40));
      });
    });
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
      .sprite(0, 0, "icons", attribute.icon ?? "danger")
      .setDisplaySize(iconWidth - 10, iconWidth - 10) // Adjust icon size
      .setOrigin(0, 0.5); // Align left and vertically center
    rowSizer.add(icon, 0, "left", { right: 10 }, false);

    // Label column (80% of remaining space)
    const label = createText(
      this.scene,
      attribute.label,
      VectorZeroes(),
      14,
    ).setOrigin(0, 0.5);
    rowSizer.add(label, labelWidthRatio, "left", { right: 10 }, true);

    // Value column (remaining space, right-aligned)
    const valueText = createText(
      this.scene,
      value,
      VectorZeroes(),
      14,
    ).setOrigin(1, 0.5);
    rowSizer.add(valueText, valueWidthRatio, "right", 0, false);

    // Layout the row
    rowSizer.layout();

    return rowSizer;
  }
}

export default AttributesPartial;
