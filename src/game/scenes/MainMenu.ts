import {GameObjects, Scene} from 'phaser';

import {EventBus} from '../EventBus';

export class MainMenu extends Scene {
    title: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }

    create() {
        this.title = this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }
}
