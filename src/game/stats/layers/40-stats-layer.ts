import { AttributeLayer } from "../attribute-layer.ts";
import { Attribute, Attributes } from "../attributes.ts";

export class StatsLayer implements AttributeLayer {
  modify(attr: Attributes): Attributes {
    const dexterity = attr.dexterity - 1;
    const agility = attr.agility - 1;
    const perception = attr.perception - 1;
    const strength = attr.strength - 1;
    const fortitude = attr.fortitude - 1;
    const endurance = attr.endurance - 1;
    const intelligence = attr.intelligence - 1;
    const charisma = attr.charisma - 1;
    const luck = attr.luck - 1;
    return {
      ...attr,
      [Attribute.evadeRating]: attr.evadeRating + dexterity * 5,
      [Attribute.attackRate]: attr.attackRate + agility * 5,
      [Attribute.criticalRating]: attr.criticalRating + perception * 5,
      [Attribute.criticalAmount]:
        attr.criticalAmount + (50 + perception * 5) / 100,
      [Attribute.damage]: attr.damage * (1 + strength * 0.05),
      [Attribute.armorRating]: attr.armorRating + fortitude * 5,
      [Attribute.flatDamageReduction]:
        attr.flatDamageReduction + fortitude * 1.25,
      [Attribute.health]: attr.health * (1 + endurance * 0.1),
      [Attribute.healthRegen]: attr.healthRegen + endurance * 2,
      [Attribute.xpRate]: attr.xpRate * (1 + intelligence * 0.11),
      [Attribute.barter]: attr.barter + charisma * 2,
      [Attribute.dropRate]:
        attr.dropRate + Phaser.Math.Clamp(1 + (luck * 2) / 100, 1, 4),
      [Attribute.dropAmount]:
        attr.dropAmount * Phaser.Math.Clamp(1 + (luck * 1.1) / 100, 1, 7),
    };
  }
}
