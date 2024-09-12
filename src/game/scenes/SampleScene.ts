import {GameObjects} from 'phaser';
import {COLOR_DARK, COLOR_LIGHT, COLOR_PRIMARY} from '../helpers/colors.ts';

class SampleScene extends Phaser.Scene {
    print: GameObjects.Text;

    constructor() {
        super('SampleScene')
    }

    create() {
        this.print = this.add.text(0, 0, '');

        this.rexUI.add.scrollablePanel({
            x: this.scene.scene.scale.width / 2,
            y: this.scene.scene.scale.height / 2,
            height: this.scene.scene.scale.height - 100,
            scrollMode: 'y',
            background: this.rexUI.add.roundRectangle({
                strokeColor: COLOR_LIGHT,
                color: COLOR_PRIMARY,
                radius: 10
            }),

            panel: {
                child: this.createPanel(),

                mask: {padding: 1,},
            },

            slider: {
                track: this.rexUI.add.roundRectangle({radius: 5, color: COLOR_DARK}),
                thumb: this.rexUI.add.roundRectangle({width: 20, height: 40, radius: 10, color: COLOR_LIGHT})
            },

            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },

            header: this.rexUI.add.label({
                space: {left: 5, right: 5, top: 5, bottom: 15},
                background: this.rexUI.add.roundRectangle({color: COLOR_PRIMARY}),
                text: this.add.text(0, 0, 'Settings', {fontSize: 20}),
                align: 'center',
            }),

            footer: this.rexUI.add.label({
                space: {left: 5, right: 5, top: 5, bottom: 5},
                background: this.rexUI.add.roundRectangle({color: COLOR_PRIMARY}),
                text: this.add.text(0, 0, 'Go Back', {fontSize: 20})
                    .setInteractive()
                    .on('pointerup', () => {
                        this.scene.start('PauseMenu');
                    })
            }),

            space: {
                left: 15,
                right: 15,
                top: 15,
                bottom: 15,
                panel: 15,
                header: 15,
                footer: 15
            }
        })
            .layout()

    }

    update() {
    }

    createPanel() {
        const panel = this.rexUI.add.sizer({
            orientation: 'y',
            space: {item: 5}
        })

        for (let i = 0; i < 8; i++) {
            const child = this.createRow(i);
            panel.add(child)
        }

        return panel;
    }

    createRow = (i: number) => {
        const width = this.scale.width - 200;
        const background = this.rexUI.add.roundRectangle({
            x: 0,
            y: 0,
            width,
            height: 60,
            color: COLOR_DARK,
            strokeColor: COLOR_LIGHT,
            radius: 10,
        });
        const text = this.add.text(-90, -10, i.toString())
        const button = this.add.text(65, -10, 'BTN')
            .setInteractive()
            .on('pointerup', () => {
                this.print.text += `Click item ${i}\n`
            })
        return this.add.container()
            .setSize(width, 60)
            .add([
                background,
                text,
                button
            ])
    }

}

export default SampleScene;
