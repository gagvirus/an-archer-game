import { Attributes } from "./attributes.ts";
import { AttributeLayer } from "./attribute-layer.ts";

export class AttributeManager {
  private baseAttributes: Attributes;
  private layers: AttributeLayer[];

  constructor(baseAttributes: Attributes) {
    this.baseAttributes = { ...baseAttributes };
    this.layers = [];
  }

  addLayer(layer: AttributeLayer) {
    this.layers.push(layer);
  }

  getFinalAttributes(): Attributes {
    return this.layers.reduce(
      (currentAttributes, layer) => layer.modify(currentAttributes),
      { ...this.baseAttributes },
    );
  }
}
