import { AttributeLayer } from "../attribute-layer.ts";
import { Attribute, Attributes } from "../attributes.ts";
import { CoreStat } from "../../helpers/stats.ts";

export class CoreStatsLayer implements AttributeLayer {
  private finesse: number;
  private awareness: number;
  private resilience: number;
  private thoughtfulness: number;

  constructor(
    coreStats: Record<CoreStat, number> = {
      [CoreStat.awareness]: 1,
      [CoreStat.finesse]: 1,
      [CoreStat.resilience]: 1,
      [CoreStat.thoughtfulness]: 1,
    },
  ) {
    this.coreStats = coreStats;
  }

  set coreStats(coreStats: Record<CoreStat, number>) {
    const { finesse, awareness, resilience, thoughtfulness } = coreStats;
    this.finesse = finesse;
    this.awareness = awareness;
    this.resilience = resilience;
    this.thoughtfulness = thoughtfulness;
  }

  get coreStats() {
    const { finesse, awareness, resilience, thoughtfulness } = this;
    return { finesse, awareness, resilience, thoughtfulness };
  }

  modify(baseAttributes: Attributes): Attributes {
    return {
      ...baseAttributes,
      [Attribute.finesse]: baseAttributes.finesse + this.finesse,
      [Attribute.awareness]: baseAttributes.awareness + this.awareness,
      [Attribute.resilience]: baseAttributes.resilience + this.resilience,
      [Attribute.thoughtfulness]:
        baseAttributes.thoughtfulness + this.thoughtfulness,
      [Attribute.dexterity]: baseAttributes.dexterity + this.finesse,
      [Attribute.agility]: baseAttributes.agility + this.finesse,
      [Attribute.perception]: baseAttributes.perception + this.awareness,
      [Attribute.strength]: baseAttributes.strength + this.awareness,
      [Attribute.fortitude]: baseAttributes.fortitude + this.resilience,
      [Attribute.endurance]: baseAttributes.endurance + this.resilience,
      [Attribute.intelligence]:
        baseAttributes.intelligence + this.thoughtfulness,
      [Attribute.charisma]: baseAttributes.charisma + this.thoughtfulness,
      [Attribute.luck]: baseAttributes.luck + this.thoughtfulness,
    };
  }

  setCoreStat(coreStat: CoreStat, amount: number) {
    this[coreStat] += amount;
  }
}
