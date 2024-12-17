import {GameObjects, Scene} from 'phaser';

import {EventBus} from '../EventBus';
import {createCenteredText} from "../helpers/text-helpers.ts";
import {ISceneLifecycle} from "../ISceneLifecycle.ts";

export class MainMenu extends Scene implements ISceneLifecycle {
  titleText: GameObjects.Text;
  startGameText: GameObjects.Text;
  settingsText: GameObjects.Text;

  constructor() {
    super('MainMenu');
  }

  create() {
    this.titleText = createCenteredText(this, 'Main Menu', -100, 38, false);
    this.startGameText = createCenteredText(this, 'Start Game', 0, 32, true);
    this.settingsText = createCenteredText(this, 'Settings', 100, 32, true);

    this.startGameText.setInteractive();

    this.startGameText.on('pointerdown', () => {
      this.scene.start('MainScene');
    });

    this.settingsText.on('pointerdown', () => {
      this.scene.start('SettingsScene');
    });

    EventBus.emit('current-scene-ready', this);
  }
}
