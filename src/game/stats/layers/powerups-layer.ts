import { AttributeLayer } from "../attribute-layer.ts";
import { Attributes } from "../attributes.ts";

export class PowerupsLayer implements AttributeLayer {
  invincibilityActive: boolean = false;
  doubleSpeedActive: boolean = false;
  doubleDamageActive: boolean = false;

  modify(baseAttributes: Attributes): Attributes {
    return {
      ...baseAttributes,
      movementSpeed:
        baseAttributes.movementSpeed * (this.doubleSpeedActive ? 1.5 : 1),
      attacksPerSecond:
        baseAttributes.attacksPerSecond * (this.doubleSpeedActive ? 1.5 : 1),
      damage: baseAttributes.damage * (this.doubleDamageActive ? 2 : 1),
      percentDamageReduction: this.invincibilityActive
        ? 1
        : baseAttributes.percentDamageReduction,
    };
  }
}
