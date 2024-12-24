import { AttributeLayer } from "../attribute-layer.ts";
import { Attributes } from "../attributes.ts";

export class CoreStatsLayer implements AttributeLayer {
  private readonly finesse: number;
  private readonly awareness: number;
  private readonly resilience: number;
  private readonly thoughtfulness: number;

  constructor(
    finesse: number = 1,
    awareness: number = 1,
    resilience: number = 1,
    thoughtfulness: number = 1,
  ) {
    this.finesse = finesse;
    this.awareness = awareness;
    this.resilience = resilience;
    this.thoughtfulness = thoughtfulness;
  }

  modify(baseAttributes: Attributes): Attributes {
    return {
      ...baseAttributes,
      dexterity: baseAttributes.dexterity + this.finesse,
      agility: baseAttributes.agility + this.finesse,
      perception: baseAttributes.perception + this.awareness,
      strength: baseAttributes.strength + this.awareness,
      fortitude: baseAttributes.fortitude + this.resilience,
      endurance: baseAttributes.endurance + this.resilience,
      intelligence: baseAttributes.intelligence + this.thoughtfulness,
      charisma: baseAttributes.charisma + this.thoughtfulness,
      luck: baseAttributes.luck + this.thoughtfulness,
    };
  }
}
