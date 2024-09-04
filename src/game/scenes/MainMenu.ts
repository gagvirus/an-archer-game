import {GameObjects, Scene} from 'phaser';

import {EventBus} from '../EventBus';
import {createCenteredText} from "../helpers/text-helpers.ts";

export class MainMenu extends Scene {
    title: GameObjects.Text;
    startGame: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }

    create() {
        this.title = createCenteredText(this, 'Main Menu', -100, 38, false);
        this.startGame = createCenteredText(this, 'Start Game', 0, 32, true);
        
        this.startGame.setInteractive()
        
        this.startGame.on('pointerdown', () => {
            this.scene.start('MainScene')
        });


        EventBus.emit('current-scene-ready', this);
    }
}
