import {Scene} from 'phaser';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import Label = UIPlugin.Label;
import Buttons = UIPlugin.Buttons;
import StatsManager, {StatGroup} from '../helpers/stats-manager.ts';
import {createText} from '../helpers/text-helpers.ts';

export class StatsScene extends Scene {
    menu: Buttons;
    statsGroup: StatGroup[];
    constructor() {
        super('StatsScene');
        this.statsGroup = StatsManager.listStatsGroups();
    }

    create() {
        this.menu = this.rexUI.add.buttons({
            x: 400,
            y: 300,
            orientation: 'y',
            buttons: this.statsGroup.map(stat => this.createButtonForStatGroup(stat)),
            space: { item: 10 }
        })
            .layout()
            .on('button.click', (button: Label, index: number) => this.handleStatSelection(button, index));

        createText(this, 'Choose Your Stat:', {x: 400, y: 100}, 24)

        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            if (['Escape', 'c', 'C'].includes(event.key)) {
                this.scene.resume('MainScene')
                this.scene.stop();
            }
        });
    }

    createButtonForStatGroup(statGroup: StatGroup) {
        return this.rexUI.add.label({
            background: this.rexUI.add.roundRectangle(0, 0, 150, 40, 20, 0x5e92f3),

            action: createText(this, statGroup.description, {x: 0, y: 0}, 12, 'center', false),
            text: createText(this, statGroup.label, {x: 0, y: 0}, 18, 'center'),
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                icon: 10,
                text: 5, // Space between text and action
                // action: 5 // Space between text and bottom padding
            },
            orientation: 1, // 1 means vertical alignment (text above action)

            // align: 'left'
        });
    }

    handleStatSelection(_: Label, index: number) {
        const selectedStatGroup = this.statsGroup[index];
        console.log(selectedStatGroup)
    }
}
