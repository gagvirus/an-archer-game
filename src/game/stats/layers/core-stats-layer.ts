import { AttributeLayer } from "../attribute-layer.ts";
import { Attributes } from "../attributes.ts";

export class CoreStatsLayer implements AttributeLayer {
  private finesse: number;
  private awareness: number;
  private resilience: number;
  private thoughtfulness: number;

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
      dexterity: this.finesse,
      agility: this.finesse,
      perception: this.awareness,
      strength: this.awareness,
      fortitude: this.resilience,
      endurance: this.resilience,
      intelligence: this.thoughtfulness,
      charisma: this.thoughtfulness,
      luck: this.thoughtfulness,
    };
  }
}
