import { AttributeLayer } from "../attribute-layer.ts";
import { Attribute, Attributes } from "../attributes.ts";
import { isEasyMode, isRapidLevelUp } from "../../helpers/registry-helper.ts";
import { Scene } from "phaser";

export class DifficultyLayer implements AttributeLayer {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  modify(baseAttributes: Attributes): Attributes {
    return {
      ...baseAttributes,
      [Attribute.xpRate]:
        baseAttributes.xpRate * (isRapidLevelUp(this.scene.game) ? 100 : 1),
      [Attribute.damage]:
        baseAttributes.damage * (isEasyMode(this.scene.game) ? 10 : 1),
      [Attribute.health]:
        baseAttributes.health * (isEasyMode(this.scene.game) ? 10 : 1),
    };
  }
}
