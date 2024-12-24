import { Attribute, Attributes } from "./attributes.ts";
import { AttributeLayer } from "./attribute-layer.ts";
import { HeroClassLayer } from "./layers/hero-class-layer.ts";
import { HeroLevelLayer } from "./layers/hero-level-layer.ts";
import { CoreStatsLayer } from "./layers/core-stats-layer.ts";
import { StatsLayer } from "./layers/stats-layer.ts";

enum LayerType {
  heroClass = "HeroClass",
  heroLevel = "HeroLevel",
  coreStats = "CoreStats",
  stats = "Stats",
}

export class AttributeManager {
  private readonly baseAttributes: Attributes;
  private layers: Record<LayerType, AttributeLayer>;

  constructor() {
    this.baseAttributes = {
      [Attribute.agility]: 0,
      [Attribute.armor]: 0,
      [Attribute.armorRating]: 0,
      [Attribute.attackRate]: 0,
      [Attribute.barter]: 0,
      [Attribute.baseAttackTime]: 0,
      [Attribute.charisma]: 0,
      [Attribute.criticalAmount]: 0,
      [Attribute.criticalRate]: 0,
      [Attribute.damage]: 0,
      [Attribute.dexterity]: 0,
      [Attribute.dropAmount]: 0,
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
      [Attribute.xpRate]: 0,
    };

    this.layers = {
      [LayerType.heroClass]: new HeroClassLayer(),
      [LayerType.heroLevel]: new HeroLevelLayer(),
      [LayerType.coreStats]: new CoreStatsLayer(),
      [LayerType.stats]: new StatsLayer(),
    };
  }

  getFinalAttributes(): Attributes {
    return Object.values(this.layers).reduce(
      (currentAttributes, layer) => layer.modify(currentAttributes),
      { ...this.baseAttributes },
    );
  }
}
