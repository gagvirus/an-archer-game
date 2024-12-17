import { GameObjects, Scene } from "phaser";
import {
  COLOR_DANGER,
  COLOR_LIGHT,
  COLOR_SUCCESS,
  COLOR_WARNING,
  COLOR_WHITE,
} from "./colors.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;
import TextStyle = Phaser.Types.GameObjects.Text.TextStyle;

const createText = (
  scene: Scene,
  text: string,
  position: Vector2Like,
  fontSize: number = 32,
  align: string = "center",
  defaultStroke: boolean = true,
  color: string = COLOR_WHITE,
  styleOverride: TextStyle = {},
): GameObjects.Text => {
  let textConfig: TextStyle = {
    fontFamily: "Arial Black",
    color,
    fontSize,
    align,
  };
  if (defaultStroke) {
    textConfig = {
      ...textConfig,
      stroke: "#000000",
      strokeThickness: Math.floor(fontSize / 4),
    };
  }
  return scene.add
    .text(position.x, position.y, text, { ...textConfig, ...styleOverride })
    .setOrigin(0.5)
    .setDepth(100);
};

const createCenteredText = (
  scene: Scene,
  text: string,
  verticalOffset: number = 0,
  fontSize: number = 32,
  isInteractive: boolean = false,
  onClick?: () => void,
) => {
  const textObject = createText(
    scene,
    text,
    {
      x: scene.scale.width / 2,
      y: scene.scale.height / 2 + verticalOffset,
    },
    fontSize,
  );

  if (isInteractive) {
    textObject.setInteractive();
    if (onClick) {
      textObject.on("pointerdown", onClick);
    }
  }

  return textObject;
};

const createAnimatedText = (scene: Scene, text: string, duration: number) => {
  const screenWidth = scene.scale.width;
  const screenHeight = scene.scale.height;

  // Create the text at the bottom of the screen
  const animatedText = createText(
    scene,
    text,
    { x: screenWidth / 2, y: screenHeight },
    48,
  );

  // Animate the text to move up to the middle of the screen
  scene.tweens.add({
    targets: animatedText,
    y: screenHeight / 2,
    duration: 1000, // 1 second duration to move up
    ease: "Power2",
  });

  // Fade out the text after a delay
  scene.time.delayedCall(duration, () => {
    scene.tweens.add({
      targets: animatedText,
      alpha: 0,
      duration: 1000, // 1 second duration to fade out
      onComplete: () => {
        animatedText.destroy(); // Destroy the text after fading out
      },
    });
  });

  return animatedText;
};

function formatNumber(value: number) {
  value = Math.round(value);
  if (value >= 1_000_000_000_000) {
    return (value / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "t";
  } else if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "b";
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  } else {
    return value.toString();
  }
}

/**
 * Displays a floating number at a given position with animation.
 * @param {Scene} scene - the game scene
 * @param {Vector2Like} position - Position to create the text
 * @param {string} text - Text to display.
 * @param {string} size - Size of the text
 * @param {"md" | "lg" | "xl" | "sm" | "sx"} color - Color of the text
 */
const showFloatingText = (
  scene: Scene,
  position: Vector2Like,
  text: string,
  size: "md" | "lg" | "xl" | "sm" | "xs" = "md",
  color: string = COLOR_WHITE,
) => {
  let fontSize = 16;
  switch (size) {
    case "xs":
      fontSize = 8;
      break;
    case "sm":
      fontSize = 12;
      break;
    case "lg":
      fontSize = 18;
      break;
    case "xl":
      fontSize = 24;
      break;
  }
  const floatingText = createText(
    scene,
    text,
    position,
    fontSize,
    "center",
    false,
    color,
  );

  scene.tweens.add({
    targets: floatingText,
    y: position.y - 50, // Move up by 50 pixels
    alpha: 0, // Fade out
    duration: 1000, // 1 second
    ease: "Power1",
    onComplete: () => {
      floatingText.destroy(); // Remove the text after the animation completes
    },
  });
};

const showDamage = (
  scene: Scene,
  position: Vector2Like,
  amount: number,
  isCritical: boolean = false,
) => {
  const color = isCritical ? COLOR_WARNING : COLOR_DANGER;
  const size = isCritical ? "lg" : "sm";
  showFloatingText(scene, position, `-${formatNumber(amount)}`, size, color);
};

const showGainedXp = (scene: Scene, position: Vector2Like, amount: number) => {
  showFloatingText(
    scene,
    position,
    `+ ${formatNumber(amount)} XP`,
    "xs",
    COLOR_SUCCESS,
  );
};

const showReplenishedHealth = (
  scene: Scene,
  position: Vector2Like,
  amount: number,
) => {
  showFloatingText(
    scene,
    position,
    `+ ${formatNumber(amount)} HP`,
    "sm",
    COLOR_LIGHT,
  );
};

const showEvaded = (scene: Scene, position: Vector2Like) => {
  showFloatingText(scene, position, "Evaded !", "md", COLOR_SUCCESS);
};

const showCollectedLoot = (
  scene: Scene,
  position: Vector2Like,
  name: string,
  amount: number,
) => {
  showFloatingText(
    scene,
    position,
    `+ ${amount} ${pluralize(amount, name)}`,
    "sm",
    COLOR_WARNING,
  );
};

const pluralize = (count: number, noun: string, suffix = "s") => {
  return `${noun}${count !== 1 ? suffix : ""}`;
};

const createAnimatedSprite = (scene: Scene, animation: string) => {
  const sprite = scene.add.sprite(0, 0, "");
  sprite.play(animation);
  return sprite;
};

export {
  createCenteredText,
  createAnimatedText,
  createText,
  formatNumber,
  showFloatingText,
  showDamage,
  showGainedXp,
  showReplenishedHealth,
  showEvaded,
  showCollectedLoot,
  pluralize,
  createAnimatedSprite,
};
