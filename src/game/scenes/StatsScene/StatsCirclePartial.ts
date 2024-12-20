import Vector2Like = Phaser.Types.Math.Vector2Like;
import Graphics = Phaser.GameObjects.Graphics;
import KeyboardPlugin = Phaser.Input.Keyboard.KeyboardPlugin;
import StatsManager, { ICoreStat } from "../../helpers/stats-manager.ts";
import { COLOR_WHITE, HEX_COLOR_DARK } from "../../helpers/colors.ts";
import { createText } from "../../helpers/text-helpers.ts";
import Tooltip from "../../ui/tooltip.ts";
import { Scene } from "phaser";
import { Renderable } from "../../helpers/ui-helper.ts";

class StatsCirclePartial implements Renderable {
  holdingShift: boolean = false;
  private tooltip: Tooltip;
  private readonly center: Vector2Like;
  private readonly coreStats: ICoreStat[];
  private readonly scene: Scene;
  private unallocatedStatsNumberText: Phaser.GameObjects.Text;
  private allocatedStatsNumberText: Phaser.GameObjects.Text[] = [];
  private statsManager: StatsManager;

  constructor(scene: Scene, statsManager: StatsManager, center: Vector2Like) {
    this.scene = scene;
    this.coreStats = StatsManager.listCoreStats();
    this.center = center;
    this.statsManager = statsManager;
  }

  render() {
    this.tooltip = new Tooltip(this.scene, 0, 0, "");
    this.coreStats.forEach((coreStat: ICoreStat, i: number) => {
      this.renderAllocateStatQuarter(coreStat, i);
      this.renderStatQuarter(coreStat, i);
      this.renderUnallocateStatQuarter(coreStat, i);
    });
    this.renderUnallocatedStatsNumber();
    this.registerKeyListeners();
  }

  updateUnallocatedStatsNumber() {
    this.unallocatedStatsNumberText.setText(
      `${this.statsManager.unallocatedStats}`,
    );
  }

  private renderAllocateStatQuarter(coreStat: ICoreStat, i: number) {
    const { colors } = coreStat;
    const [, darkColor, darkerColor] = colors;

    // Draw each section of the circle
    const startAngle = (Math.PI / 2) * i; // Start angle
    const endAngle = startAngle + Math.PI / 2; // End angle
    const buttonRadius = 180; // Quarter-circle button radius

    // Calculate button position (closer to center)
    const buttonAngle = startAngle + Math.PI / 4; // Center of the quarter
    const buttonX = this.center.x + buttonRadius * Math.cos(buttonAngle) * 0.85; // Closer to the center
    const buttonY = this.center.y + buttonRadius * Math.sin(buttonAngle) * 0.85;

    // Create quarter-circle button using Graphics
    const buttonGraphics = this.scene.add.graphics();
    this.renderQuarterCircle(
      buttonGraphics,
      darkColor,
      buttonRadius,
      startAngle,
      endAngle,
    );

    // Add a small icon in the quarter-circle button
    const offsetX = [1, 2].includes(i) ? -10 : 10;
    const offsetY = i > 1 ? -10 : 10;
    const buttonIcon = this.scene.add
      .sprite(buttonX + offsetX, buttonY + offsetY, "icons", "up")
      .setInteractive()
      .on("pointerdown", () => {
        this.handleStatClick(i);
      })
      .on("pointerover", () => {
        this.renderQuarterCircle(
          buttonGraphics,
          darkerColor,
          buttonRadius,
          startAngle,
          endAngle,
        );
      })
      .on("pointerout", () => {
        this.renderQuarterCircle(
          buttonGraphics,
          darkColor,
          buttonRadius,
          startAngle,
          endAngle,
        );
      });
    buttonIcon.setOrigin(0.5).setScale(0.8);
  }

  private renderUnallocatedStatsNumber() {
    this.scene.add.circle(this.center.x, this.center.y, 25, HEX_COLOR_DARK);
    this.unallocatedStatsNumberText = createText(
      this.scene,
      this.statsManager.unallocatedStats + "",
      this.center,
      20,
    )
      .setInteractive()
      .on("pointerover", () => {
        this.tooltip.show(
          'Number of unallocated stat points.\n\nHold "Shift" button to bulk allocate stat points.',
        );
      })
      .on("pointerout", () => {
        this.tooltip.hide();
      });
  }

  private renderStatQuarter(coreStat: ICoreStat, i: number) {
    const graphics = this.scene.add.graphics();
    const radius = 150; // Circle radius
    const { colors, icon } = coreStat;
    const [color, darkerColor] = colors;

    // Draw each section of the circle
    const startAngle = (Math.PI / 2) * i; // Start angle
    const endAngle = startAngle + Math.PI / 2; // End angle

    // Draw the section of the circle with the plain color
    this.renderQuarterCircle(graphics, color, radius, startAngle, endAngle);

    // Calculate the angle for placing elements in the center of each section
    const midAngle = startAngle + Math.PI / 4; // Middle of the quarter

    // Text position
    const textPosition = {
      x: this.center.x + radius * Math.cos(midAngle) * 0.7,
      y: this.center.y + radius * Math.sin(midAngle) * 0.7,
    };

    const container = this.scene.add.container(textPosition.x, textPosition.y);
    const iconSprite = this.scene.add
      .sprite(0, -10, "icons", icon)
      .setOrigin(0.5)
      .setScale(0.8)
      .setInteractive()
      .on("pointerover", () => {
        this.tooltip.show(coreStat.label + "\n\n" + coreStat.description);
      })
      .on("pointerout", () => {
        this.tooltip.hide();
      });
    this.allocatedStatsNumberText[i] = createText(
      this.scene,
      this.statsManager.getCoreStat(coreStat.prop) + "",
      {
        x: 0,
        y: 10,
      },
      16,
      "center",
      false,
      COLOR_WHITE,
    );
    const circleBackground = this.scene.add.circle(0, 0, 35, darkerColor);
    container.add([
      circleBackground,
      iconSprite,
      this.allocatedStatsNumberText[i],
    ]);
  }

  private renderUnallocateStatQuarter(coreStat: ICoreStat, i: number) {
    const { colors } = coreStat;
    const [, darkColor, darkerColor] = colors;

    // Draw each section of the circle
    const startAngle = (Math.PI / 2) * i; // Start angle
    const endAngle = startAngle + Math.PI / 2; // End angle
    const buttonRadius = 65; // Quarter-circle button radius

    // Calculate button position (closer to center)
    const buttonAngle = startAngle + Math.PI / 4; // Center of the quarter
    const buttonX = this.center.x + buttonRadius * Math.cos(buttonAngle) * 0.3; // Closer to the center
    const buttonY = this.center.y + buttonRadius * Math.sin(buttonAngle) * 0.3;

    // Create quarter-circle button using Graphics
    const buttonGraphics = this.scene.add.graphics();
    this.renderQuarterCircle(
      buttonGraphics,
      darkColor,
      buttonRadius,
      startAngle,
      endAngle,
    );

    // Add a small icon in the quarter-circle button
    const offsetX = [1, 2].includes(i) ? -15 : 15;
    const offsetY = i > 1 ? -15 : 15;
    const buttonIcon = this.scene.add
      .sprite(buttonX + offsetX, buttonY + offsetY, "icons", "down")
      .setInteractive()
      .on("pointerdown", () => {
        this.handleStatClick(i, true);
      })
      .on("pointerover", () => {
        this.renderQuarterCircle(
          buttonGraphics,
          darkerColor,
          buttonRadius,
          startAngle,
          endAngle,
        );
        // buttonGraphics.color
      })
      .on("pointerout", () => {
        this.renderQuarterCircle(
          buttonGraphics,
          darkColor,
          buttonRadius,
          startAngle,
          endAngle,
        );
      });
    buttonIcon.setOrigin(0.5).setScale(1);
  }

  private renderQuarterCircle(
    graphics: Graphics,
    color: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ) {
    const { x, y } = this.center;
    graphics.fillStyle(color, 1);
    graphics.moveTo(x, y);
    graphics.beginPath();
    graphics.arc(x, y, radius, startAngle, endAngle, false);
    graphics.lineTo(x, y);
    graphics.closePath();
    graphics.fillPath();
  }

  private handleStatClick(index: number, unallocating: boolean = false) {
    const selectedCoreStat = this.coreStats[index];
    const selectedStatCurrentAmount = this.statsManager.getCoreStat(
      selectedCoreStat.prop,
    );
    if (!unallocating && this.statsManager.unallocatedStats < 1) {
      return;
    }
    if (unallocating && selectedStatCurrentAmount <= 1) {
      return;
    }
    let statsCount = 1;
    if (this.holdingShift) {
      statsCount = 10;
      if (unallocating) {
        // if there is not enough allocated points on the selected stat group,
        // set stats count to current stat number
        if (selectedStatCurrentAmount - 1 < statsCount) {
          statsCount = selectedStatCurrentAmount - 1;
        }
      } else {
        if (statsCount > this.statsManager.unallocatedStats) {
          statsCount = this.statsManager.unallocatedStats;
        }
      }
    }
    const isUnallocatingMultiplier = unallocating ? -1 : 1;
    this.statsManager.unallocatedStats -= statsCount * isUnallocatingMultiplier;
    this.updateUnallocatedStatsNumber();
    this.statsManager.addStat(
      selectedCoreStat.prop,
      statsCount * isUnallocatingMultiplier,
    );
    this.allocatedStatsNumberText[index].setText(
      this.statsManager.getCoreStat(selectedCoreStat.prop) + "",
    );
    this.scene.events.emit("statsUpdated", { coreStat: selectedCoreStat });
  }

  private registerKeyListeners() {
    const statsHotkeys = this.coreStats.map((coreStat) => coreStat.hotkey);
    const keyboard = this.scene.input.keyboard as KeyboardPlugin;

    keyboard
      .on("keydown", (event: KeyboardEvent) => {
        if (statsHotkeys.includes(event.key.toUpperCase())) {
          const index = this.coreStats.findIndex(
            (f) => f.hotkey == event.key.toUpperCase(),
          );
          this.handleStatClick(index);
        }
        if (["Shift"].includes(event.key)) {
          this.holdingShift = true;
          this.updateUI();
        }
      })
      .on("keyup", (event: KeyboardEvent) => {
        if (["Shift"].includes(event.key)) {
          this.holdingShift = false;
          this.updateUI();
        }
      });
  }

  private updateUI() {
    // todo: up button becomes double up ?
  }
}

export default StatsCirclePartial;
