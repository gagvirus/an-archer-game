import { Attribute, Attributes } from "./attributes.ts";
import { AttributeLayer } from "./attribute-layer.ts";
import { HeroClassLayer } from "./layers/10-hero-class-layer.ts";
import { HeroLevelLayer } from "./layers/20-hero-level-layer.ts";
import { CoreStatsLayer } from "./layers/30-core-stats-layer.ts";
import { StatsLayer } from "./layers/40-stats-layer.ts";
import { PowerupsLayer } from "./layers/70-powerups-layer.ts";
import { IAttribute, ICoreStat } from "../helpers/stats-manager.ts";
import coreStats, { CoreStat, StatType } from "../helpers/stats.ts";
import FinalLayer from "./layers/60-final-layer.ts";
import { DifficultyLayer } from "./layers/50-difficulty-layer.ts";
import { Scene } from "phaser";
import { PowerupType } from "../game-objects/drop/powerup/timed/powerupType.ts";
import { HeroClass } from "../helpers/hero-manager.ts";
import { getSelectedHeroClass } from "../helpers/registry-helper.ts";

enum LayerType {
  heroClass = "HeroClass",
  heroLevel = "HeroLevel",
  coreStats = "CoreStats",
  stats = "Stats",
  powerups = "Powerups",
  difficulty = "difficulty",
  final = "Final",
}

export const listAttributes = () => {
  const allAttributes: Record<StatType, IAttribute[]> = {
    [StatType.offensive]: [],
    [StatType.defensive]: [],
    [StatType.miscellaneous]: [],
  };
  listCoreStats().forEach((coreStat) => {
    coreStat.stats.forEach((stat) => {
      stat.attributes.forEach((attribute) => {
        allAttributes[attribute.type].push(attribute);
      });
    });
  });
  return allAttributes;
};

export const listCoreStats = (): ICoreStat[] => {
  return coreStats;
};

export class AttributeManager {
  private readonly baseAttributes: Attributes;
  private readonly layers: Record<LayerType, AttributeLayer>;
  private _attributes: Attributes;
  private readonly scene: Phaser.Scene;

  constructor(
    scene: Scene,
    heroClass: HeroClass = getSelectedHeroClass(),
    heroLevel: number = 1,
    coreStats: Record<CoreStat, number> = {
      [CoreStat.awareness]: 1,
      [CoreStat.finesse]: 1,
      [CoreStat.resilience]: 1,
      [CoreStat.thoughtfulness]: 1,
    },
  ) {
    this.scene = scene;
    this.baseAttributes = {
      [Attribute.finesse]: 0,
      [Attribute.awareness]: 0,
      [Attribute.resilience]: 0,
      [Attribute.thoughtfulness]: 0,
      [Attribute.attacksPerSecond]: 0,
      [Attribute.evadeChance]: 0,
      [Attribute.flatDamageReduction]: 0,
      [Attribute.percentDamageReduction]: 0,
      [Attribute.agility]: 0,
      [Attribute.movementSpeed]: 0,
      [Attribute.armorRating]: 0,
      [Attribute.attackRate]: 0,
      [Attribute.barter]: 0,
      [Attribute.baseAttackTime]: 0,
      [Attribute.charisma]: 0,
      [Attribute.criticalAmount]: 1,
      [Attribute.criticalRating]: 0,
      [Attribute.criticalChance]: 0,
      [Attribute.damage]: 0,
      [Attribute.dexterity]: 0,
      [Attribute.dropAmount]: 1,
      [Attribute.dropRate]: 0,
      [Attribute.endurance]: 0,
      [Attribute.evadeRating]: 0,
      [Attribute.fortitude]: 0,
      [Attribute.health]: 0,
      [Attribute.healthRegen]: 0,
      [Attribute.healthRegenInterval]: 0,
      [Attribute.intelligence]: 0,
      [Attribute.luck]: 0,
      [Attribute.perception]: 0,
      [Attribute.strength]: 0,
      [Attribute.xpRate]: 1,
    };

    this.layers = {
      [LayerType.heroClass]: new HeroClassLayer(heroClass),
      [LayerType.heroLevel]: new HeroLevelLayer(heroLevel),
      [LayerType.coreStats]: new CoreStatsLayer(coreStats),
      [LayerType.stats]: new StatsLayer(),
      [LayerType.difficulty]: new DifficultyLayer(),
      [LayerType.final]: new FinalLayer(),
      [LayerType.powerups]: new PowerupsLayer(),
    };

    this._unallocatedStats = 0;
  }

  private _unallocatedStats: number;

  get unallocatedStats() {
    return this._unallocatedStats;
  }

  set unallocatedStats(value: number) {
    this._unallocatedStats = value;
  }

  get heroClassLayer(): HeroClassLayer {
    return this.getLayer(LayerType.heroClass) as HeroClassLayer;
  }

  get heroLevelLayer(): HeroLevelLayer {
    return this.getLayer(LayerType.heroLevel) as HeroLevelLayer;
  }

  get coreStatsLayer(): CoreStatsLayer {
    return this.getLayer(LayerType.coreStats) as CoreStatsLayer;
  }

  get powerupsLayer(): PowerupsLayer {
    return this.getLayer(LayerType.powerups) as PowerupsLayer;
  }

  recalculate() {
    this._attributes = Object.values(this.layers).reduce(
      (currentAttributes, layer) => layer.modify(currentAttributes),
      { ...this.baseAttributes },
    );
    return this;
  }

  addStat(stat: CoreStat, amount: number) {
    this.coreStatsLayer.addCoreStat(stat, amount);
    this.recalculate();
  }

  setHeroLevel(newLevel: number) {
    this.heroLevelLayer.setLevel(newLevel);
    this.recalculate();
  }

  setPowerupActive(powerupType: PowerupType, active: boolean) {
    this.powerupsLayer.setActive(powerupType, active);
    this.recalculate();
  }

  private getAttributes(): Attributes {
    if (!this._attributes) {
      this.recalculate();
    }
    return this._attributes;
  }

  getAttribute(attribute: Attribute) {
    return this.getAttributes()[attribute];
  }

  get xpRate() {
    return this.getAttribute(Attribute.xpRate);
  }

  get healthRegenInterval() {
    return this.getAttribute(Attribute.healthRegenInterval);
  }

  get healthRegen() {
    return this.getAttribute(Attribute.healthRegen);
  }

  get evadeChance() {
    return this.getAttribute(Attribute.evadeChance);
  }

  get damage() {
    return this.getAttribute(Attribute.damage);
  }

  get attacksPerSecond() {
    return this.getAttribute(Attribute.attacksPerSecond);
  }

  get health() {
    return this.getAttribute(Attribute.health);
  }

  get movementSpeed() {
    return this.getAttribute(Attribute.movementSpeed);
  }

  get criticalChance() {
    return this.getAttribute(Attribute.criticalChance);
  }

  get criticalAmount() {
    return this.getAttribute(Attribute.criticalAmount);
  }

  get dropRate() {
    return this.getAttribute(Attribute.dropRate);
  }

  get dropAmount() {
    return this.getAttribute(Attribute.dropAmount);
  }

  getFinalAttributes(): Attributes {
    return Object.values(this.layers).reduce(
      (currentAttributes, layer) => layer.modify(currentAttributes),
      { ...this.baseAttributes },
    );
  }

  getLayer(layerType: LayerType) {
    return this.layers[layerType];
  }

  getFinalDamageReduction(incomingDamage: number) {
    const { flatDamageReduction, percentDamageReduction } =
      this.getAttributes();
    const afterFlatReduction = incomingDamage - flatDamageReduction;
    return flatDamageReduction + afterFlatReduction * percentDamageReduction;
  }

  getDps() {
    const { criticalChance, criticalAmount, damage, attacksPerSecond } =
      this.getAttributes();
    const pureDps = attacksPerSecond * damage;
    const criticalAttacksNumber = (attacksPerSecond * criticalChance) / 100;
    const criticalExtraDamage =
      criticalAttacksNumber * damage * (criticalAmount - 1);
    return pureDps + criticalExtraDamage;
  }

  getPreviewWithChangedStat(
    coreStat: CoreStat,
    amount: number,
  ): Partial<Attributes> {
    const clone = new AttributeManager(
      this.scene,
      this.heroClassLayer.heroClass,
      this.heroLevelLayer.level,
      this.coreStatsLayer.coreStats,
    );
    clone.coreStatsLayer.addCoreStat(coreStat, amount);
    return this.getObjectDifference<Attributes>(
      this.getFinalAttributes(),
      clone.getFinalAttributes(),
    );
  }
  getObjectDifference<T>(obj1: T, obj2: T): Partial<T> {
    const result: Partial<T> = {};
    for (const key in obj2) {
      if (obj2[key] !== obj1[key]) {
        result[key] = obj2[key];
      }
    }

    return result;
  }
}
