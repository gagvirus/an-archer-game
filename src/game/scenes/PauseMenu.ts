import {GameObjects, Scene} from 'phaser';

import {EventBus} from '../EventBus';
import {createCenteredText} from "../helpers/text-helpers.ts";

export class PauseMenu extends Scene {
    title: GameObjects.Text;
    startGame: GameObjects.Text;

    constructor() {
        super('PauseMenu');
    }

    create() {
        this.title = createCenteredText(this, 'Pause Menu', -100, 38, false);
        this.startGame = createCenteredText(this, 'Resume', 0, 32, true);
        
        this.startGame.setInteractive()
        
        this.startGame.on('pointerdown', () => {
            this.scene.resume('MainScene')
            this.scene.stop();
        });


        EventBus.emit('current-scene-ready', this);
    }
}
