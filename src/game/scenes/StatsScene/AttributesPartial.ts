import { Renderable } from "../../helpers/ui-helper.ts";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import { IAttribute, ICoreStat } from "../../helpers/stats-manager.ts";
import {
  COLOR_DANGER,
  COLOR_SUCCESS,
  HEX_COLOR_DARK,
  HEX_COLOR_WHITE,
} from "../../helpers/colors.ts";
import { createText } from "../../helpers/text-helpers.ts";
import { VectorZeroes } from "../../helpers/position-helper.ts";
import { GameObjects, Scene } from "phaser";
import { StatType } from "../../helpers/stats.ts";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import {
  AttributeManager,
  listAttributes,
} from "../../stats/attribute-manager.ts";
import { Attribute } from "../../stats/attributes.ts";

class AttributesPartial implements Renderable {
  private readonly scene: Phaser.Scene;
  private readonly width: number;
  private attributes: AttributeManager;
  private allAttributes: Record<StatType, IAttribute[]>;
  private attributeRows: Partial<Record<Attribute, Sizer>> = {};
  private holdingShift: boolean = false;
  private panel: ScrollablePanel;

  constructor(
    scene: Scene,
    width: number,
    panel: ScrollablePanel,
    attributes: AttributeManager,
  ) {
    this.scene = scene;
    this.width = width;
    this.attributes = attributes;
    this.panel = panel;
    this.allAttributes = listAttributes();
  }

  render(container: Sizer) {
    this.scene.events
      .on("statsUpdated", this.onStatsUpdated, this)
      .on("statPointerOver", this.statPointerOver, this)
      .on("statPointerOut", this.statPointerOut, this)
      .on("holdingShiftChange", this.onHoldingShiftChange, this);
    Object.keys(this.allAttributes).forEach((statType) => {
      container.add(createText(this.scene, statType, VectorZeroes(), 16));
      this.allAttributes[statType as StatType].forEach((attribute) => {
        container.add(this.renderAttributeRow(attribute, this.width - 40));
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

  private statPointerOver(data: {
    coreStat: ICoreStat;
    unallocating: boolean;
  }) {
    const { coreStat, unallocating } = data;
    const currentStatAmount = this.attributes.getAttribute(
      coreStat.prop as unknown as Attribute,
    );
    const allocatingAmount = this.holdingShift
      ? this.attributes.unallocatedStats >= 10
        ? 10
        : this.attributes.unallocatedStats
      : 1;
    const diff = this.attributes.getPreviewWithChangedStat(
      coreStat.prop,
      currentStatAmount + allocatingAmount,
    );
    Object.keys(diff).forEach((attribute) => {
      const plusMinus = unallocating ? "-" : "+";
      this.showDiffText(
        attribute as Attribute,
        `${plusMinus}${diff[attribute as Attribute]}`,
      );
    });
  }

  private statPointerOut() {
    Object.values(this.attributeRows).forEach((attributeRow) => {
      (attributeRow.getChildren()[4] as Phaser.GameObjects.Text)
        .setText("")
        .setVisible(false);
    });
  }

  private onHoldingShiftChange(holdingShift: boolean) {
    if (holdingShift !== this.holdingShift) {
      this.holdingShift = holdingShift;
      Object.values(this.attributeRows).forEach((attributeRow) => {
        const textObject =
          attributeRow.getChildren()[4] as Phaser.GameObjects.Text;
        let newText;
        if (holdingShift) {
          newText = textObject.text.startsWith("+") ? "++" : "--";
        } else {
          newText = textObject.text.startsWith("+") ? "+" : "-";
        }
        (attributeRow.getChildren()[4] as Phaser.GameObjects.Text).setText(
          newText,
        );
        attributeRow.layout();
      });
    }
  }

  private onStatsUpdated = ({ coreStat }: { coreStat: ICoreStat }) => {
    coreStat.stats.forEach((stat) => {
      stat.attributes.forEach((attribute) => {
        const value = parseFloat(
          this.attributes.getAttribute(attribute.prop).toFixed(2),
        ).toString();
        if (this.attributeRows[attribute.prop]) {
          const sizer = this.attributeRows[attribute.prop] as Sizer;
          (sizer.getChildren()[3] as GameObjects.Text).setText(value);
          sizer.layout();
        }
      });
    });
  };

  private showDiffText(attribute: Attribute, value: string) {
    if (this.attributeRows[attribute]) {
      const row = this.attributeRows[attribute] as Sizer;
      const diffText = row.getChildren()[4] as Phaser.GameObjects.Text;
      const color = value.startsWith("-") ? COLOR_DANGER : COLOR_SUCCESS;

      const isVisible = Phaser.Geom.Rectangle.Overlaps(
        this.panel.getBounds(),
        row.getBounds(),
      );

      diffText.setText(value);
      diffText.setColor(color);
      diffText.setVisible(isVisible);
      row.layout();
    }
  }

  private renderAttributeRow(attribute: IAttribute, rowWidth: number) {
    const value = parseFloat(
      this.attributes.getAttribute(attribute.prop).toFixed(2),
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
    const diffText = createText(
      this.scene,
      "+",
      VectorZeroes(),
      14,
      "center",
      false,
      COLOR_SUCCESS,
    ).setVisible(false);

    rowSizer.add(diffText);

    // Layout the row
    rowSizer.layout();
    this.attributeRows[attribute.prop] = rowSizer;
    return rowSizer;
  }
}

export default AttributesPartial;
