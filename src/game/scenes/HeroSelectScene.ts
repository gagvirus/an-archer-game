import { Scene } from "phaser";
import { EventBus } from "../EventBus.ts";
import { ISceneLifecycle } from "../ISceneLifecycle.ts";
import { HEX_COLOR_LIGHT, HEX_COLOR_PRIMARY } from "../helpers/colors.ts";
import { HeroClass, heroClasses } from "../helpers/hero-manager.ts";

class HeroSelectScene extends Scene implements ISceneLifecycle {
  constructor() {
    super("HeroSelectScene");
  }

  create() {
    EventBus.emit("current-scene-ready", this);
    this.renderHeroSelectionCards();
  }

  renderHeroSelectionCards() {
    this.rexUI.add
      .scrollablePanel({
        x: this.scale.width / 2,
        y: this.scale.height / 2,
        height: this.scale.height - 100,
        scrollMode: 0, // Vertical scroll
        panel: {
          child: this.createHeroGrid(),
          mask: {
            padding: 2,
          },
        },

        slider: {
          track: this.add.rectangle(0, 0, 20, 10, 0x888888),
          thumb: this.add.circle(0, 0, 10, 0xffffff),
        },

        space: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
          panel: 10,
        },
      })
      .layout();
  }

  private createHeroGrid() {
    const heroes = Object.values(HeroClass);
    const padding = 10; // Padding between cards
    const gridSizer = this.rexUI.add.gridSizer({
      column: 4, // 4 items per row
      row: Math.ceil(heroes.length / 4),
      columnProportions: 1,
      rowProportions: 1,
      space: {
        column: padding,
        row: padding,
      },
    });

    heroes.forEach((heroClass) => {
      const card = this.createHeroCard(heroClass);
      gridSizer.add(card, { expand: false });
    });

    return gridSizer;
  }

  private createHeroCard(heroClass: HeroClass) {
    const hero = heroClasses[heroClass];
    const heroDescription = `${heroClass} description`;
    const heroPreviewIcon = `archer-${hero.color}-running`;
    const width = (this.scale.width - 200) / 4;
    const height = 250;

    const card = this.rexUI.add
      .sizer({
        orientation: "vertical",
        width,
        height,
        space: { item: 10 },
      })
      .addBackground(
        this.rexUI.add.roundRectangle({
          strokeColor: HEX_COLOR_LIGHT,
          color: HEX_COLOR_PRIMARY,
          radius: 10,
        }),
      );

    const icon = this.add
      .sprite(0, 0, heroPreviewIcon, 0)
      .setDisplaySize(80, 80)
      .setOrigin(0.5);
    const title = this.add.text(0, 0, heroClass, {
      fontSize: "18px",
      color: "#ffffff",
    });
    const description = this.add.text(0, 0, heroDescription, {
      fontSize: "14px",
      color: "#cccccc",
      wordWrap: { width: width - 20 },
    });

    card.add(icon, { proportion: 0, align: "center" });
    card.add(title, { proportion: 0, align: "center" });
    card.add(description, { proportion: 0, align: "center" });

    card.layout();

    return card;
  }
}

export default HeroSelectScene;
