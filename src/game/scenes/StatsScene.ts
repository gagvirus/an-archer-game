import {Scene} from 'phaser';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import StatsManager, {StatGroup} from '../helpers/stats-manager.ts';
import {createText} from '../helpers/text-helpers.ts';
import Label = UIPlugin.Label;
import Buttons = UIPlugin.Buttons;

export class StatsScene extends Scene {
    menu: Buttons;
    statsGroup: StatGroup[];
    statsManager: StatsManager;
    chooseStatsText: Phaser.GameObjects.Text;
    statsButtons: Label[];

    constructor() {
        super('StatsScene');
        this.statsGroup = StatsManager.listStatsGroups();
    }

    init(data: { statsManager: StatsManager }) {
        this.statsManager = data.statsManager;
    }

    create() {
        this.statsButtons = this.statsGroup.map(stat => this.createButtonForStatGroup(stat));
        this.menu = this.rexUI.add.buttons({
            x: 400,
            y: 300,
            orientation: 'y',
            buttons: this.statsButtons,
            space: {item: 10}
        })
            .layout()
            .on('button.click', (button: Label, index: number) => this.handleStatSelection(button, index));

        this.chooseStatsText = createText(this, 'Choose Stats', {x: 400, y: 100}, 24)
        this.updateUnallocatedStatsNumber(this.statsManager.unallocatedStats);

        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            if (['Escape', 'c', 'C'].includes(event.key)) {
                this.scene.resume('MainScene')
                this.scene.stop();
            }
        });
    }

    updateUnallocatedStatsNumber(newNumber: number)
    {
        let chooseStatsLabel = 'Choose Stats'

        if (newNumber > 0) {
            chooseStatsLabel += ' [' + this.statsManager.unallocatedStats + ']';
        }

        this.chooseStatsText.setText(chooseStatsLabel);
    }

    createButtonForStatGroup(statGroup: StatGroup) {

        return this.rexUI.add.label({
            background: this.rexUI.add.roundRectangleCanvas(100, 330, 100, 100, {
                radius: 15,
                iteration: 0
            }, 0x008888),
            text: createText(this, this.getStatText(statGroup), {x: 0, y: 0}, 18, 'left'),
            action: createText(this, statGroup.description, {x: 0, y: 0}, 12, 'center', false),
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                icon: 10,
                text: 5, // Space between text and action
                // action: 5 // Space between text and bottom padding
            },
            orientation: 'top-to-bottom', // 1 means vertical alignment (text above action)
            align: 'left'
        });
    }

    getStatText(statGroup: StatGroup)
    {
        // @ts-expect-error the stat names is present on the stat manager
        const currentStat = this.statsManager[statGroup.prop];
        return `${statGroup.label} [${currentStat}]`;
    }

    handleStatSelection(_: Label, index: number) {
        if (this.statsManager.unallocatedStats < 1) {
            return;
        }
        const selectedStatGroup = this.statsGroup[index];
        this.updateUnallocatedStatsNumber(this.statsManager.unallocatedStats -= 1);
        // @ts-expect-error the stat names is present on the stat manager
        this.statsManager[selectedStatGroup.prop] += 1;
        this.statsButtons[index].setText(this.getStatText(selectedStatGroup))
    }
}
