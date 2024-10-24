import {GameObjects, Scene} from 'phaser';

import {EventBus} from '../EventBus';
import {createCenteredText} from "../helpers/text-helpers.ts";

export class PauseMenu extends Scene {
    title: GameObjects.Text;
    resume: GameObjects.Text;
    backToMainMenu: GameObjects.Text;

    constructor() {
        super('PauseMenu');
    }

    create() {
        this.title = createCenteredText(this, 'Pause Menu', -150, 38, false);
        this.resume = createCenteredText(this, 'Resume', -75, 32, true);
        this.backToMainMenu = createCenteredText(this, 'Back to Main Menu', 0, 32, true);

        this.resume.setInteractive()

        this.resume.on('pointerdown', () => {
            this.scene.resume('MainScene')
            this.scene.stop();
        });

        this.backToMainMenu.on('pointerdown', () => {
            this.scene.stop('MainScene');
            this.scene.stop();
            this.scene.start('MainMenu')
        });

        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                this.scene.resume('MainScene')
                this.scene.stop();
            }
        });

        EventBus.emit('current-scene-ready', this);
    }
}
