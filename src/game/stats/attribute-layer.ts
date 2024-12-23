import { Attributes } from "./attributes.ts";

export interface AttributeLayer {
  modify(baseAttributes: Attributes): Attributes;
}
