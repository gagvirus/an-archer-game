import { Scene } from "phaser";
import { EventBus } from "../EventBus.ts";
import { ISceneLifecycle } from "../ISceneLifecycle.ts";
import { HEX_COLOR_LIGHT, HEX_COLOR_PRIMARY } from "../helpers/colors.ts";
import HeroManager, {
  HeroClass,
  heroClasses,
} from "../helpers/hero-manager.ts";
import {
  getSelectedHeroClass,
  setSelectedHeroClass,
} from "../helpers/registry-helper.ts";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { createText } from "../helpers/text-helpers.ts";
import RoundRectangle = UIPlugin.RoundRectangle;

class HeroSelectScene extends Scene implements ISceneLifecycle {
  private selectedHeroClass: HeroClass;
  private cards: Partial<Record<HeroClass, Sizer>> = {};
  private scrollablePanel: ScrollablePanel;

  constructor() {
    super("HeroSelectScene");
  }

  create() {
    this.selectedHeroClass = getSelectedHeroClass();
    this.renderHeroSelectionCards();

    createText(
      this,
      "Go Back",
      {
        x: 100,
        y: this.scale.height - 100,
      },
      20,
    )
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("MainMenu");
      });

    EventBus.emit("current-scene-ready", this);
  }

  renderHeroSelectionCards() {
    this.scrollablePanel = this.rexUI.add
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
    const active = this.selectedHeroClass === heroClass;

    const card = this.rexUI.add
      .sizer({
        orientation: "vertical",
        width,
        height,
        space: { item: 10 },
      })
      .addBackground(
        this.rexUI.add.roundRectangle({
          strokeWidth: 2,
          strokeColor: active ? HEX_COLOR_PRIMARY : HEX_COLOR_LIGHT,
          color: active ? HEX_COLOR_LIGHT : HEX_COLOR_PRIMARY,
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
    this.cards[heroClass] = card;

    card
      .setInteractive()
      .on("pointerdown", () => {
        this.selectedHeroClass = heroClass;
        setSelectedHeroClass(heroClass);
        HeroManager.getInstance(this).registerHeroAnimations();
        Object.keys(this.cards).forEach((hc) => {
          const c = this.cards[hc as HeroClass] as Sizer;
          const bg = c.getChildren()[0] as RoundRectangle;
          const active = hc === this.selectedHeroClass;
          bg.setFillStyle(active ? HEX_COLOR_LIGHT : HEX_COLOR_PRIMARY);
          bg.setStrokeStyle(2, active ? HEX_COLOR_PRIMARY : HEX_COLOR_LIGHT);
        });
        this.scrollablePanel.layout();
      })
      .layout();

    return card;
  }
}

export default HeroSelectScene;
