import { AttributeLayer } from "../attribute-layer.ts";
import { Attributes } from "../attributes.ts";
import { PowerupType } from "../../logic/drop/powerup/timed/powerupType.ts";

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
        baseAttributes.attackRate * (this.doubleSpeedActive ? 2 : 1),
      damage: baseAttributes.damage * (this.doubleDamageActive ? 2 : 1),
      percentDamageReduction: this.invincibilityActive
        ? 1
        : baseAttributes.percentDamageReduction,
    };
  }

  private getPowerupFieldFromType(powerupType: PowerupType) {
    switch (powerupType) {
      case PowerupType.DoubleDamage:
        return "doubleDamageActive";
      case PowerupType.DoubleSpeed:
        return "doubleSpeedActive";
      case PowerupType.Invulnerability:
        return "invincibilityActive";
      default:
        throw new Error(`Invalid powerupType ${powerupType}`);
    }
  }

  public setActive(powerupType: PowerupType, active: boolean) {
    const field = this.getPowerupFieldFromType(powerupType);
    this[field] = active;
  }
}
