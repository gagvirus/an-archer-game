import {Scene} from "phaser";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import StatsManager, {IAttribute, ICoreStat} from "../helpers/stats-manager.ts";
import {createText} from "../helpers/text-helpers.ts";
import {VectorZeroes} from "../helpers/position-helper.ts";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import Tooltip from "../ui/tooltip.ts";
import Label = UIPlugin.Label;
import Buttons = UIPlugin.Buttons;
import {
  HEX_COLOR_BLUE_INTELLIGENCE,
  HEX_COLOR_GREEN_AGILITY,
  HEX_COLOR_RED_STRENGTH,
  HEX_COLOR_YELLOW_MISCELLANEOUS
} from "../helpers/colors.ts";

export class StatsScene extends Scene {
  statsSelectButtons: Buttons;
  statsGroup: ICoreStat[];
  attributes: IAttribute[];
  statsManager: StatsManager;
  chooseStatsText: Phaser.GameObjects.Text;
  statsButtons: Label[];
  holdingShift: boolean = false;
  holdingAlt: boolean = false;
  private wrapper: Sizer;
  private tooltip: Tooltip;

  constructor() {
    super("StatsScene");
    this.statsGroup = StatsManager.listStatsGroups();
    this.attributes = StatsManager.listAttributes();
  }

  init(data: { statsManager: StatsManager }) {
    this.statsManager = data.statsManager;
  }

  create() {
    const statsHotkeys = this.statsGroup.map((statGroup) => statGroup.hotkey);

    const parentWidth = this.scale.width / 2 - 40

    this.wrapper = this.rexUI.add.sizer({
      x: this.scale.width / 2,
      y: this.scale.height / 2,
      width: parentWidth,
      height: this.scale.height - 40,
      orientation: "horizontal",
    })

    this.createShit()
    this.wrapper
      // .add(this.createShit())
      // .add(this.createStatsSelectColumn())
      .add(this.createChildStatsColumn())
      .add(this.createAttributesColumn())
      .layout();

    // this.updateUnallocatedStatsNumber(this.statsManager.unallocatedStats);

    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (["Escape", "c", "C"].includes(event.key)) {
        this.scene.resume("MainScene")
        this.scene.stop();
      }
      if (statsHotkeys.includes(event.key.toUpperCase())) {
        const index = this.statsGroup.findIndex(f => f.hotkey == event.key.toUpperCase());
        this.handleStatClick(index);
      }
      if (["Shift"].includes(event.key)) {
        this.holdingShift = true;
        this.updateUI();
      }
      if (["Alt"].includes(event.key)) {
        this.holdingAlt = true;
        this.updateUI();
      }
    });

    this.input.keyboard?.on("keyup", (event: KeyboardEvent) => {
      if (["Shift"].includes(event.key)) {
        this.holdingShift = false;
        this.updateUI();
      }
      if (["Alt"].includes(event.key)) {
        this.holdingAlt = false;
        this.updateUI();
      }
    });
    this.tooltip = new Tooltip(this, 0, 0, "");
  }

  createShit() {
    // Circle properties
    const centerX = 400; // Circle center X
    const centerY = 300; // Circle center Y
    const radius = 100;  // Circle radius
    const colors = [
      HEX_COLOR_RED_STRENGTH, // Dark Red for Strength
      HEX_COLOR_GREEN_AGILITY, // Dark Green for Dexterity
      HEX_COLOR_BLUE_INTELLIGENCE, // Dark Blue for Intelligence
      HEX_COLOR_YELLOW_MISCELLANEOUS  // Dark Goldenrod for Luck
    ]; // Colors for each piece
    const texts = ['Strength', 'Dexterity', 'Intelligence', 'Luck']; // Text for each piece
    const icons = ['strength-icon', 'dexterity-icon', 'intelligence-icon', 'luck-icon']; // Names of icons in the atlas


    // Create a Graphics object
    const graphics = this.add.graphics();

    // Draw each quarter of the circle and add rotated text
    for (let i = 0; i < 4; i++) {
      const startAngle = (Math.PI / 2) * i; // Start angle
      const endAngle = startAngle + Math.PI / 2; // End angle

      // Draw the section of the circle with the plain color
      graphics.fillStyle(colors[i], 1);
      graphics.beginPath();
      graphics.moveTo(centerX, centerY);
      graphics.arc(centerX, centerY, radius, startAngle, endAngle, false);
      graphics.closePath();
      graphics.fillPath();

      // Calculate the angle for placing text in the center of each section
      const textAngle = startAngle + Math.PI / 4; // Middle of the quarter

      // Calculate text position in the center of the section
      const textX = centerX + radius * Math.cos(textAngle) * 0.5; // 50% toward edge
      const textY = centerY + radius * Math.sin(textAngle) * 0.5;

      // Add the text
      const text = this.add.text(textX, textY, texts[i], {
        font: '16px Arial',
        color: '#ffffff',
        align: 'center',
      });
      text.setOrigin(0.5); // Center the text horizontally and vertically

      const icon = this.add.sprite(textX, textY - 20, 'icons', icons[i]);
      icon.setOrigin(0.5); // Center the icon
      icon.setScale(0.5); // Adjust scale if necessary (e.g., 50% size of the original)
    }
  }
  createStatsSelectColumn() {
    this.statsButtons = this.statsGroup.map(stat => this.createButtonForStatGroup(stat));
    const statsSelectWrapper = this.rexUI.add.sizer({
      orientation: "vertical",
    })

    this.statsSelectButtons = this.rexUI.add.buttons({
      orientation: "y",
      buttons: this.statsButtons,
      space: {item: 10}
    })
      .layout()
      .on("button.click", (_: Label, index: number) => this.handleStatClick(index));

    this.chooseStatsText = createText(this, "Choose Stats", VectorZeroes(), 24)

    statsSelectWrapper
      .add(this.chooseStatsText)
      .add(this.statsSelectButtons).layout();

    return statsSelectWrapper;
  }

  createChildStatsColumn() {
    const childStatsWrapper = this.rexUI.add.sizer({
      orientation: "vertical",
    })

    childStatsWrapper.add(createText(this, "Child Stats", VectorZeroes()))

    this.statsGroup.forEach((statGroup) => {
      statGroup.stats.forEach((stat) => {
        const value = this.statsManager.getChildStat(stat.prop);
        childStatsWrapper.add(createText(this, `${stat.label}: ${value}`, VectorZeroes(), 16, "left", false))
      })
    })

    return childStatsWrapper
  }

  createAttributesColumn() {
    const attributesWrapper = this.rexUI.add.sizer({
      orientation: "vertical",
    })

    attributesWrapper.add(createText(this, "Attributes", VectorZeroes()))

    this.attributes.forEach((attribute) => {
      const value = parseFloat(this.statsManager.getAttribute(attribute.prop).toFixed(2));
      attributesWrapper.add(createText(this, `${attribute.label}: ${value}`, VectorZeroes(), 16, "left", false))
    })

    return attributesWrapper
  }

  updateUnallocatedStatsNumber(newNumber: number) {
    let chooseStatsLabel = "Choose Stats"

    if (newNumber > 0) {
      chooseStatsLabel += " [" + this.statsManager.unallocatedStats + "]";
    }

    this.chooseStatsText.setText(chooseStatsLabel);
  }

  createButtonForStatGroup(statGroup: ICoreStat) {
    const text = createText(this, this.getStatText(statGroup), VectorZeroes(), 18, "left").setInteractive();
    text.on("pointerover", () => {
      this.tooltip.show(text.x, text.y);
      this.tooltip.setText(statGroup.description);
    }).on("pointerout", () => {
      this.tooltip.hide();
    })
    return this.rexUI.add.label({
      background: this.rexUI.add.roundRectangleCanvas(0, 0, 0, 0, {
        radius: 15,
        iteration: 0
      }, 0x008888),
      text,
      space: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
        icon: 10,
        text: 5, // Space between text and actioncc
        // action: 5 // Space between text and bottom padding
      },
      orientation: "top-to-bottom", // 1 means vertical alignment (text above action)
      align: "left"
    });
  }

  getStatText(statGroup: ICoreStat) {
    const currentStat = this.statsManager.getCoreStat(statGroup.prop);
    const icon = this.holdingAlt ? (this.holdingShift ? "--" : "-") : this.holdingShift ? "++" : "+";
    return `[${statGroup.hotkey}] ${statGroup.label} [${currentStat}] ${icon}`;
  }

  handleStatClick(index: number) {
    const selectedStatGroup = this.statsGroup[index];
    const selectedStatCurrentAmount = this.statsManager.getCoreStat(selectedStatGroup.prop);
    if (!this.holdingAlt && this.statsManager.unallocatedStats < 1) {
      return;
    }
    if (this.holdingAlt && selectedStatCurrentAmount <= 1) {
      return;
    }
    let statsCount = 1;
    if (this.holdingShift) {
      statsCount = 10;
      if (this.holdingAlt) {
        // if there is not enough allocated points on the selected stat group,
        // set stats count to current stat number
        if (selectedStatCurrentAmount - 1 < statsCount) {
          statsCount = selectedStatCurrentAmount - 1;
        }
      } else {
        if (statsCount > this.statsManager.unallocatedStats) {
          statsCount = this.statsManager.unallocatedStats
        }
      }
    }
    const isUnallocatingMultiplier = this.holdingAlt ? -1 : 1;
    this.updateUnallocatedStatsNumber(this.statsManager.unallocatedStats -= statsCount * isUnallocatingMultiplier);
    this.statsManager.addStat(selectedStatGroup.prop, statsCount * isUnallocatingMultiplier);
    this.statsButtons[index].setText(this.getStatText(selectedStatGroup))
    this.events.emit("statsUpdated")
  }

  updateUI() {
    this.statsButtons.forEach((button, index) => button.setText(this.getStatText(this.statsGroup[index])))
  }
}
