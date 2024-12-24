import { AttributeLayer } from "../attribute-layer.ts";
import { Attributes } from "../attributes.ts";

export class PowerupsLayer implements AttributeLayer {
  constructor() {}

  modify(baseAttributes: Attributes): Attributes {
    return {
      ...baseAttributes,
    };
  }
}
