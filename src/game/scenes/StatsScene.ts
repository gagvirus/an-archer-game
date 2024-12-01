import {Scene} from 'phaser';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import Label = UIPlugin.Label;
import Buttons = UIPlugin.Buttons;

export class StatsScene extends Scene {
    menu: Buttons;
    constructor() {
        super('StatsScene');
    }

    create() {
        const stats = ['Strength', 'Agility', 'Endurance'];

        this.menu = this.rexUI.add.buttons({
            x: 400,
            y: 300,
            orientation: 'y',
            buttons: stats.map(stat => this.createButton(stat)),
            space: { item: 10 }
        })
            .layout()
            .on('button.click', (button: Label) => this.handleStatSelection(button));

        this.add.text(400, 100, 'Choose Your Stat:', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            if (['Escape', 'c', 'C'].includes(event.key)) {
                this.scene.resume('MainScene')
                this.scene.stop();
            }
        });
    }

    createButton(label: string) {
        return this.rexUI.add.label({
            background: this.rexUI.add.roundRectangle(0, 0, 150, 40, 20, 0x5e92f3),
            text: this.add.text(0, 0, label, { fontSize: '18px', color: '#ffffff' }),
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            },
            align: 'center'
        });
    }

    handleStatSelection(button: Label) {
        console.log(button)
        console.log(`Player chose: ${button.text}`);
        // Add logic to handle stat selection, such as updating the player's stats
    }
}
