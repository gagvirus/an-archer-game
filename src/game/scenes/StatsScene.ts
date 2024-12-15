import {Scene} from "phaser";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import StatsManager, {IAttribute, ICoreStat} from "../helpers/stats-manager.ts";
import {createText} from "../helpers/text-helpers.ts";
import {VectorZeroes} from "../helpers/position-helper.ts";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import Tooltip from "../ui/tooltip.ts";
import {COLOR_WHITE, HEX_COLOR_DARK} from "../helpers/colors.ts";
import Label = UIPlugin.Label;
import Buttons = UIPlugin.Buttons;
import Graphics = Phaser.GameObjects.Graphics;
import Vector2Like = Phaser.Types.Math.Vector2Like;

export class StatsScene extends Scene {
  statsSelectButtons: Buttons;
  statsGroup: ICoreStat[];
  attributes: IAttribute[];
  statsManager: StatsManager;
  chooseStatsText: Phaser.GameObjects.Text;
  statsButtons: Label[];
  holdingShift: boolean = false;
  private wrapper: Sizer;
  private tooltip: Tooltip;
  private radialStatsCenter: Vector2Like = {x: 400, y: 300};

  constructor() {
    super("StatsScene");
    this.statsGroup = StatsManager.listCoreStats();
    this.attributes = StatsManager.listAttributes();
  }

  init(data: { statsManager: StatsManager }) {
    this.statsManager = data.statsManager;
  }

  create() {
    const statsHotkeys = this.statsGroup.map((coreStat) => coreStat.hotkey);

    const parentWidth = this.scale.width / 2 - 40

    this.wrapper = this.rexUI.add.sizer({
      x: this.scale.width / 2,
      y: this.scale.height / 2,
      width: parentWidth,
      height: this.scale.height - 40,
      orientation: "horizontal",
    })

    this.createStatsCircle()
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
    });

    this.input.keyboard?.on("keyup", (event: KeyboardEvent) => {
      if (["Shift"].includes(event.key)) {
        this.holdingShift = false;
        this.updateUI();
      }
    });
    this.tooltip = new Tooltip(this, 0, 0, "");
  }

  createStatsCircle() {
    // Create a Graphics object
    this.statsGroup.forEach((coreStat: ICoreStat, i: number) => this.renderStatCirclePartial(coreStat, i));
    this.renderUnallocatedStatsNumber();
  }

  renderStatCirclePartial(coreStat: ICoreStat, i: number) {
    this.renderAllocateStatQuarter(coreStat, i);
    this.renderStatQuarter(coreStat, i);
    this.renderUnallocateStatQuarter(coreStat, i);
  }

  private renderAllocateStatQuarter(coreStat: ICoreStat, i: number) {
    const {colors, label} = coreStat;
    const [, darkColor, darkerColor] = colors;

    // Draw each section of the circle
    const startAngle = (Math.PI / 2) * i; // Start angle
    const endAngle = startAngle + Math.PI / 2; // End angle
    const buttonRadius = 180; // Quarter-circle button radius

    // Calculate button position (closer to center)
    const buttonAngle = startAngle + Math.PI / 4; // Center of the quarter
    const buttonX = this.radialStatsCenter.x + buttonRadius * Math.cos(buttonAngle) * 0.85; // Closer to the center
    const buttonY = this.radialStatsCenter.y + buttonRadius * Math.sin(buttonAngle) * 0.85;

    // Create quarter-circle button using Graphics
    const buttonGraphics = this.add.graphics();
    this.renderQuarterCircle(buttonGraphics, darkColor, buttonRadius, startAngle, endAngle);

    // Add a small icon in the quarter-circle button
    const offsetX = [1, 2].includes(i) ? -10 : 10;
    const offsetY = i > 1 ? -10 : 10;
    const buttonIcon = this.add.sprite(buttonX + offsetX, buttonY + offsetY, "icons", "up")
      .setInteractive()
      .on("pointerdown", () => {
        console.log(`allocate to ${label} button clicked!`);
      }).on("pointerover", () => {
        this.renderQuarterCircle(buttonGraphics, darkerColor, buttonRadius, startAngle, endAngle);
        // buttonGraphics.color
      }).on("pointerout", () => {
        this.renderQuarterCircle(buttonGraphics, darkColor, buttonRadius, startAngle, endAngle);
      })
    ;
    buttonIcon.setOrigin(0.5).setScale(0.8);
  }

  renderUnallocatedStatsNumber() {
    this.add.circle(this.radialStatsCenter.x, this.radialStatsCenter.y, 25, HEX_COLOR_DARK);
    createText(this, this.statsManager.unallocatedStats + "", this.radialStatsCenter, 20)
  }

  private renderStatQuarter(coreStat: ICoreStat, i: number) {
    const graphics = this.add.graphics();
    const radius = 150;  // Circle radius
    const {colors, icon, label} = coreStat;
    const [color] = colors;

    // Draw each section of the circle
    const startAngle = (Math.PI / 2) * i; // Start angle
    const endAngle = startAngle + Math.PI / 2; // End angle

    // Draw the section of the circle with the plain color
    this.renderQuarterCircle(graphics, color, radius, startAngle, endAngle);

    // Calculate the angle for placing elements in the center of each section
    const midAngle = startAngle + Math.PI / 4; // Middle of the quarter

    // Text position
    const textPosition = {
      x: this.radialStatsCenter.x + radius * Math.cos(midAngle) * 0.6,
      y: this.radialStatsCenter.y + radius * Math.sin(midAngle) * 0.6
    };

    createText(this, label, textPosition, 14, "center", false, COLOR_WHITE).setOrigin(0.5)

    this.add.sprite(textPosition.x, textPosition.y - 20, "icons", icon).setOrigin(0.5);
  }

  private renderUnallocateStatQuarter(coreStat: ICoreStat, i: number) {
    const {colors, label} = coreStat;
    const [, darkColor, darkerColor] = colors;

    // Draw each section of the circle
    const startAngle = (Math.PI / 2) * i; // Start angle
    const endAngle = startAngle + Math.PI / 2; // End angle
    const buttonRadius = 65; // Quarter-circle button radius

    // Calculate button position (closer to center)
    const buttonAngle = startAngle + Math.PI / 4; // Center of the quarter
    const buttonX = this.radialStatsCenter.x + buttonRadius * Math.cos(buttonAngle) * 0.3; // Closer to the center
    const buttonY = this.radialStatsCenter.y + buttonRadius * Math.sin(buttonAngle) * 0.3;

    // Create quarter-circle button using Graphics
    const buttonGraphics = this.add.graphics();
    this.renderQuarterCircle(buttonGraphics, darkColor, buttonRadius, startAngle, endAngle);

    // Add a small icon in the quarter-circle button
    const offsetX = [1, 2].includes(i) ? -15 : 15;
    const offsetY = i > 1 ? -15 : 15;
    const buttonIcon = this.add.sprite(buttonX + offsetX, buttonY + offsetY, "icons", "down")
      .setInteractive()
      .on("pointerdown", () => {
        console.log(`unallocate from ${label} button clicked!`);
      }).on("pointerover", () => {
        this.renderQuarterCircle(buttonGraphics, darkerColor, buttonRadius, startAngle, endAngle);
        // buttonGraphics.color
      }).on("pointerout", () => {
        this.renderQuarterCircle(buttonGraphics, darkColor, buttonRadius, startAngle, endAngle);
      })
    ;
    buttonIcon.setOrigin(0.5).setScale(1);
  }

  renderQuarterCircle(graphics: Graphics, color: number, radius: number, startAngle: number, endAngle: number) {
    const {x, y} = this.radialStatsCenter;
    graphics.fillStyle(color, 1);
    graphics.moveTo(x, y);
    graphics.beginPath();
    graphics.arc(x, y, radius, startAngle, endAngle, false);
    graphics.lineTo(x, y);
    graphics.closePath();
    graphics.fillPath();
  }

  createStatsSelectColumn() {
    this.statsButtons = this.statsGroup.map(stat => this.createButtonForCoreStat(stat));
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

    this.statsGroup.forEach((coreStat) => {
      coreStat.stats.forEach((stat) => {
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

  createButtonForCoreStat(coreStat: ICoreStat) {
    const text = createText(this, this.getStatText(coreStat), VectorZeroes(), 18, "left").setInteractive();
    text.on("pointerover", () => {
      this.tooltip.show(text.x, text.y);
      this.tooltip.setText(coreStat.description);
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

  getStatText(coreStat: ICoreStat) {
    const currentStat = this.statsManager.getCoreStat(coreStat.prop);
    const icon = this.holdingShift ? "++" : "+";
    return `[${coreStat.hotkey}] ${coreStat.label} [${currentStat}] ${icon}`;
  }

  handleStatClick(index: number) {
    const selectedCoreStat = this.statsGroup[index];
    if (this.statsManager.unallocatedStats < 1) {
      return;
    }
    const statsCount = Phaser.Math.Clamp(this.holdingShift ? 10 : 1, 0, this.statsManager.unallocatedStats);
    this.updateUnallocatedStatsNumber(this.statsManager.unallocatedStats -= statsCount);
    this.statsManager.addStat(selectedCoreStat.prop, statsCount);
    this.statsButtons[index].setText(this.getStatText(selectedCoreStat))
    this.events.emit("statsUpdated")
  }

  updateUI() {
    this.statsButtons.forEach((button, index) => button.setText(this.getStatText(this.statsGroup[index])))
  }
}
