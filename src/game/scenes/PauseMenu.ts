import { Scene } from "phaser";
import { createText } from "../helpers/text-helpers.ts";
import { ISceneLifecycle } from "../ISceneLifecycle.ts";
import { VectorZeroes } from "../helpers/position-helper.ts";

export class PauseMenu extends Scene implements ISceneLifecycle {
  constructor() {
    super("PauseMenu");
  }

  create() {
    // Get the game dimensions
    const { width, height } = this.scale;

    // Create the root sizer container
    const rootSizer = this.rexUI.add
      .sizer({
        orientation: "horizontal", // Horizontal layout
        x: width / 2,
        y: height / 2,
        width: width - 40,
        height: height - 40,
        space: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
          item: 20,
        },
      })
      .setOrigin(0.5);

    const pauseMenu = this.renderPauseMenu();
    const statisticsMenu = this.renderStatisticsMenu();

    rootSizer.add(pauseMenu);
    rootSizer.add(statisticsMenu);

    rootSizer.layout();

    // debug
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0xff0000, 0.5);
    const statisticsMenuBounds = statisticsMenu.getBounds();
    graphics.strokeRect(
      statisticsMenuBounds.x,
      statisticsMenuBounds.y,
      statisticsMenuBounds.width,
      statisticsMenuBounds.height,
    );
    // end debug

    // const renderer = new GameStatisticsPartial(this, (width - 40) / 2, height);
    // renderer.render(statisticsMenu);

    rootSizer.layout();
  }

  // create2() {
  //   this.title = createCenteredText(this, "Pause Menu", -150, 38, false);
  //   this.resume = createCenteredText(this, "Resume", -75, 32, true);
  //   this.backToMainMenu = createCenteredText(
  //     this,
  //     "Back to Main Menu",
  //     0,
  //     32,
  //     true,
  //   );
  //
  //   this.resume.setInteractive();
  //
  //   this.resume.on("pointerdown", () => {
  //     this.scene.resume("MainScene");
  //     this.scene.stop();
  //   });
  //
  //   this.backToMainMenu.on("pointerdown", () => {
  //     this.scene.stop("MainScene");
  //     this.scene.stop();
  //     this.scene.start("MainMenu");
  //   });
  //
  //   this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
  //     if (event.key === "Escape") {
  //       this.scene.resume("MainScene");
  //       this.scene.stop();
  //     }
  //   });
  //
  //   EventBus.emit("current-scene-ready", this);
  //
  //   const container = this.rexUI.add.sizer();
  //
  //   const renderer = new GameStatisticsPartial(this);
  //   renderer.render(container);
  // }
  private renderPauseMenu() {
    const { width, height } = this.scale;
    const pauseMenu = this.rexUI.add.sizer({
      orientation: "vertical",
      width: (width - 40) / 2,
      height: height - 40,
    });

    const title = createText(this, "Pause Menu", VectorZeroes(), 38);
    const resume = createText(this, "Resume", VectorZeroes(), 32)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.resume("MainScene");
        this.scene.stop();
      });
    const backToMainMenu = createText(
      this,
      "Back to Main Menu",
      VectorZeroes(),
      32,
    )
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.stop("MainScene");
        this.scene.stop();
        this.scene.start("MainMenu");
      });
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        this.scene.resume("MainScene");
        this.scene.stop();
      }
    });
    pauseMenu.add(title, { align: "center", proportion: 0.4 });
    pauseMenu.add(resume, { align: "center", proportion: 0.3 });
    pauseMenu.add(backToMainMenu, { align: "center", proportion: 0.3 });

    pauseMenu.layout();

    return pauseMenu;
  }

  private renderStatisticsMenu() {
    const { width, height } = this.scale;
    const statisticsMenu = this.rexUI.add.sizer({
      orientation: "vertical",
      width: (width - 40) / 2,
      height: height - 40,
    });
    return statisticsMenu;
  }
}
