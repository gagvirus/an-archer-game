export enum PowerupType {
  DoubleDamage = "DoubleDamage",
  DoubleSpeed = "DoubleSpeed",
  Invulnerability = "Invulnerability",
}

export const PowerupIconMap = {
  [PowerupType.DoubleDamage]: "double-damage",
  [PowerupType.DoubleSpeed]: "double-speed",
  [PowerupType.Invulnerability]: "invulnerability",
};
