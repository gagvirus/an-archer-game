import {Scene} from 'phaser';
import KeyboardPlugin = Phaser.Input.Keyboard.KeyboardPlugin;
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export interface CustomCursorKeysDown {
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean
}

const createCursorKeys = (scene: Scene): CustomCursorKeysDown => {
  const keyboard = scene.input.keyboard as KeyboardPlugin;
  const defaultCursorKeys = keyboard.createCursorKeys();
  const wasdCursorKeys = keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D
  }) as CursorKeys;

  return {
    up: defaultCursorKeys.up.isDown || wasdCursorKeys.up.isDown,
    down: defaultCursorKeys.down.isDown || wasdCursorKeys.down.isDown,
    left: defaultCursorKeys.left.isDown || wasdCursorKeys.left.isDown,
    right: defaultCursorKeys.right.isDown || wasdCursorKeys.right.isDown,
  };
};

export {createCursorKeys};
