import { Attribute, Attributes } from "./attributes.ts";
import { AttributeLayer } from "./attribute-layer.ts";
import { HeroClassLayer } from "./layers/hero-class-layer.ts";
import { HeroLevelLayer } from "./layers/hero-level-layer.ts";
import { CoreStatsLayer } from "./layers/core-stats-layer.ts";
import { StatsLayer } from "./layers/stats-layer.ts";
import { PowerupsLayer } from "./layers/powerups-layer.ts";

enum LayerType {
  heroClass = "HeroClass",
  heroLevel = "HeroLevel",
  coreStats = "CoreStats",
  stats = "Stats",
  powerups = "Powerups",
}

export class AttributeManager {
  private readonly baseAttributes: Attributes;
  private layers: Record<LayerType, AttributeLayer>;
  private _attributes: Attributes;

  constructor() {
    this.baseAttributes = {
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
      [LayerType.powerups]: new PowerupsLayer(),
    };
  }

  get heroClassLayer() {
    return this.getLayer(LayerType.heroClass);
  }

  get heroLevelLayer() {
    return this.getLayer(LayerType.heroLevel);
  }

  get coreStatsLayer() {
    return this.getLayer(LayerType.coreStats);
  }

  get statsLayer() {
    return this.getLayer(LayerType.stats);
  }

  get powerupsLayer() {
    return this.getLayer(LayerType.powerups);
  }

  recalculate() {
    this._attributes = Object.values(this.layers).reduce(
      (currentAttributes, layer) => layer.modify(currentAttributes),
      { ...this.baseAttributes },
    );
    return this;
  }

  getAttributes(): Attributes {
    return this._attributes;
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
}
