import { AttributeLayer } from "../attribute-layer.ts";
import { Attributes } from "../attributes.ts";

export class InventoryLayer implements AttributeLayer {
  // private inventoryBonuses: Partial<Attributes>;

  constructor() // inventoryBonuses: Partial<Attributes>
  {
    // this.inventoryBonuses = inventoryBonuses;
  }

  modify(baseAttributes: Attributes): Attributes {
    return {
      ...baseAttributes,
      // ...Object.keys(this.inventoryBonuses).reduce((acc, key) => {
      //   acc[key] =
      //     (baseAttributes[key] || 0) + (this.inventoryBonuses[key] || 0);
      //   return acc;
      // }, {} as Attributes),
    };
  }
}
