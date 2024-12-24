import { AttributeLayer } from "../attribute-layer.ts";
import { Attribute, Attributes } from "../attributes.ts";

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
}
