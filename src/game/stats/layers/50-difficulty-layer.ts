import { AttributeLayer } from "../attribute-layer.ts";
import { Attribute, Attributes } from "../attributes.ts";
import { isEasyMode, isRapidLevelUp } from "../../helpers/registry-helper.ts";

export class DifficultyLayer implements AttributeLayer {
  modify(baseAttributes: Attributes): Attributes {
    return {
      ...baseAttributes,
      [Attribute.xpRate]: baseAttributes.xpRate * (isRapidLevelUp() ? 100 : 1),
      [Attribute.damage]: baseAttributes.damage * (isEasyMode() ? 10 : 1),
      [Attribute.health]: baseAttributes.health * (isEasyMode() ? 10 : 1),
    };
  }
}
