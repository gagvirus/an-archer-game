import { Renderable } from "../../helpers/ui-helper.ts";
import { GameObjects, Scene } from "phaser";
import { IChildStat, ICoreStat } from "../../helpers/stats-manager.ts";
import { HEX_COLOR_DARK, HEX_COLOR_WHITE } from "../../helpers/colors.ts";
import { createText } from "../../helpers/text-helpers.ts";
import { VectorZeroes } from "../../helpers/position-helper.ts";
import Tooltip from "../../ui/tooltip.ts";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import { ChildStat } from "../../helpers/stats.ts";
import PlusMinusIcon from "../../ui/plus-minus-icon.ts";
import {
  AttributeManager,
  listCoreStats,
} from "../../stats/attribute-manager.ts";
import { Attribute } from "../../stats/attributes.ts";

class StatsCirclePartial implements Renderable {
  private coreStats: ICoreStat[];
  private readonly scene: Phaser.Scene;
  private attributes: AttributeManager;
  private tooltip: Tooltip;
  private readonly width: number;
  private statRows: Partial<Record<ChildStat, Sizer>> = {};
  private holdingShift: boolean = false;

  constructor(scene: Scene, width: number, statsManager: AttributeManager) {
    this.scene = scene;
    this.width = width;
    this.attributes = statsManager;
    this.coreStats = listCoreStats();
    this.tooltip = new Tooltip(this.scene);
  }

  render(container: Sizer) {
    this.scene.events
      .on("statsUpdated", this.onStatsUpdated, this)
      .on("statPointerOver", this.statPointerOver, this)
      .on("statPointerOut", this.statPointerOut, this)
      .on("holdingShiftChange", this.onHoldingShiftChange, this);
    this.coreStats.forEach((coreStat) => {
      coreStat.stats.forEach((stat) => {
        container.add(this.renderStatRow(stat, this.width - 40));
      });
    });
  }

  destroy() {
    this.scene.events
      .off("statsUpdated", this.onStatsUpdated, this)
      .off("statPointerOver", this.statPointerOver, this)
      .off("statPointerOut", this.statPointerOut, this)
      .off("holdingShiftChange", this.onHoldingShiftChange, this);
  }

  private onStatsUpdated = ({ coreStat }: { coreStat: ICoreStat }) => {
    coreStat.stats.forEach((stat) => {
      const value = parseFloat(
        this.attributes
          .getAttribute(stat.prop as unknown as Attribute)
          .toFixed(2),
      ).toString();
      if (this.statRows[stat.prop]) {
        const sizer = this.statRows[stat.prop] as Sizer;
        (sizer.getChildren()[3] as GameObjects.Text).setText(value);
        sizer.layout();
      }
    });
  };

  private statPointerOver = (data: {
    coreStat: ICoreStat;
    unallocating: boolean;
  }) => {
    const { coreStat, unallocating } = data;
    coreStat.stats.forEach((childStat) => {
      (
        (
          this.statRows[childStat.prop] as Sizer
        ).getChildren()[4] as PlusMinusIcon
      )
        .setMinus(unallocating)
        .setVisible(true);
    });
  };
  private statPointerOut = () => {
    Object.values(this.statRows).forEach((statRow) => {
      (statRow.getChildren()[4] as PlusMinusIcon).setVisible(false);
    });
  };

  private renderStatRow(stat: IChildStat, rowWidth: number) {
    const value = parseFloat(
      this.attributes
        .getAttribute(stat.prop as unknown as Attribute)
        .toFixed(2),
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

    const plusMinusIcon = new PlusMinusIcon(this.scene, 0, 0, true).setVisible(
      false,
    );

    rowSizer.add(plusMinusIcon);

    // Layout the row
    rowSizer.layout();
    this.statRows[stat.prop] = rowSizer;
    return rowSizer;
  }

  private onHoldingShiftChange(holdingShift: boolean) {
    if (holdingShift !== this.holdingShift) {
      this.holdingShift = holdingShift;
      Object.values(this.statRows).forEach((statRow) => {
        (statRow.getChildren()[4] as PlusMinusIcon).setBulk(this.holdingShift);
        statRow.layout();
      });
    }
  }
}

export default StatsCirclePartial;
