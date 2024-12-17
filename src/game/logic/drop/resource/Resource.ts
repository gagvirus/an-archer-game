import { Scene } from "phaser";
import { Drop } from "../Drop.ts";
import { addLogEntry, LogEntryCategory } from "../../../helpers/log-utils.ts";
import {
  formatNumber,
  pluralize,
  showCollectedLoot,
} from "../../../helpers/text-helpers.ts";
import { COLOR_WARNING } from "../../../helpers/colors.ts";
import MainScene from "../../../scenes/MainScene.ts";

export enum ResourceType {
  coin = "coin",
  soul = "soul",
}

export abstract class Resource extends Drop {
  amount: number;

  protected constructor(
    scene: Scene,
    x: number,
    y: number,
    amount: number = 1,
    name: ResourceType = ResourceType.coin,
  ) {
    super(scene, x, y, name);
    this.amount = amount;
  }

  onCollected() {
    const scene = this.scene as MainScene;
    const name = this.name as ResourceType;
    const amount = this.amount;
    scene.hero.collectResource(name, amount);
    addLogEntry(
      "Collected :amount :name",
      {
        amount: [formatNumber(amount), COLOR_WARNING],
        name: [pluralize(amount, name), COLOR_WARNING],
      },
      LogEntryCategory.Loot,
    );
    showCollectedLoot(scene, scene.hero, name, amount);
  }
}
