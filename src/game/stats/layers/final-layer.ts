import { AttributeLayer } from "../attribute-layer.ts";
import { Attribute, Attributes } from "../attributes.ts";

export default class FinalLayer implements AttributeLayer {
  modify(baseAttributes: Attributes): Attributes {
    console.log(
      baseAttributes.attackRate / 100 / baseAttributes.baseAttackTime,
    );
    return {
      ...baseAttributes,
      [Attribute.percentDamageReduction]:
        this.getPercentDamageReduction(baseAttributes),
      [Attribute.evadeChance]: Phaser.Math.Clamp(
        baseAttributes.evadeRating / 3,
        0,
        90,
      ),
      [Attribute.attacksPerSecond]:
        baseAttributes.attackRate / 100 / baseAttributes.baseAttackTime,
      [Attribute.criticalChance]: Phaser.Math.Clamp(
        baseAttributes.criticalRating / 3,
        0,
        90,
      ),
    };
  }

  private getPercentDamageReduction(baseAttributes: Attributes) {
    if (baseAttributes.percentDamageReduction >= 1) {
      return 1;
    }
    const maxReduction = 0.9; // Maximum 90% reduction
    const scalingFactor = 800; // Higher value makes percentage scale slower
    const reduction =
      1 - scalingFactor / (scalingFactor + baseAttributes.armorRating);
    return Math.min(reduction, maxReduction);
  }
}
