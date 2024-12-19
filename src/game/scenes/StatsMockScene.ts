import { Scene } from "phaser";
import { HEX_COLOR_DARK, HEX_COLOR_WHITE } from "../helpers/colors.ts";
import { ISceneLifecycle } from "../ISceneLifecycle.ts";
import { createText } from "../helpers/text-helpers.ts";
import { VectorZeroes } from "../helpers/position-helper.ts";
import StatsManager, { ICoreStat } from "../helpers/stats-manager.ts";
import Hero from "../logic/Hero.ts";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import UiHelper from "../helpers/ui-helper.ts";
import StatsCirclePartial from "./StatsScene/StatsCirclePartial.ts";
import ChildStatsPartial from "./StatsScene/ChildStatsPartial.ts";
import AttributesPartial from "./StatsScene/AttributesPartial.ts";

export default class StatsMockScene extends Scene implements ISceneLifecycle {
  private readonly coreStats: ICoreStat[];
  private statsManager: StatsManager;
  private fullWidth: number = 1200;

  constructor() {
    super({ key: "StatsScene" });
    this.coreStats = StatsManager.listCoreStats();
  }

  init(data: { statsManager: StatsManager }) {
    if (data.statsManager) {
      this.statsManager = data.statsManager;
    } else {
      this.statsManager = new StatsManager(this, new Hero(this, -100, -100));
    }
  }

  create() {
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (["Escape", "c", "C"].includes(event.key)) {
        this.scene.resume("MainScene");
        this.scene.stop();
      }
    });
    if (this.scale.width > 1280) {
      this.fullWidth = this.scale.width * 0.9;
      if (this.scale.width > 1600) {
        this.fullWidth = this.scale.width * 0.8;
        if (this.scale.width > 1900) {
          this.fullWidth = this.scale.width * 0.7;
        }
      }
    }

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
  }

  private createAttributesPanel() {
    const width = this.fullWidth * 0.3;

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
      height: this.scale.height * 0.7,
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

    const renderer = new AttributesPartial(this, width, this.statsManager);
    renderer.render(container);

    return panel;
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
        x: this.scale.width / 2,
        y: this.scale.height / 2,
      },
    );
    statsCircleRenderer.render();
    statsCircleRenderer.updateUnallocatedStatsNumber();

    return container;
  }

  private createStatsPanel() {
    const width = this.fullWidth * 0.3;
    const container = this.createContainer(
      "Stats",
      width, // 3/10 width of the full screen width minus padding 10%
      this.scale.height * 0.7, // full height minus padding
    );
    const renderer = new ChildStatsPartial(this, width, this.statsManager);
    renderer.render(container);
    return container;
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
