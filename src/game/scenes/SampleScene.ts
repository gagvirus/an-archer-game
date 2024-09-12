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
            x: 400,
            y: 300,
            height: 320,
            scrollMode: 'y',
            background: this.rexUI.add.roundRectangle({
                strokeColor: COLOR_LIGHT,
                color: COLOR_PRIMARY,
                radius: 10
            }),

            panel: {
                child: createPanel(this),

                mask: {padding: 1,},
            },

            slider: {
                track: this.rexUI.add.roundRectangle({width: 20, radius: 10, color: COLOR_DARK}),
                thumb: this.rexUI.add.roundRectangle({radius: 13, color: COLOR_LIGHT})
            },

            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },

            header: this.rexUI.add.label({
                space: {left: 5, right: 5, top: 5, bottom: 5},
                background: this.rexUI.add.roundRectangle({color: COLOR_PRIMARY}),
                text: this.add.text(0, 0, 'Header', {fontSize: 20})
            }),

            footer: this.rexUI.add.label({
                space: {left: 5, right: 5, top: 5, bottom: 5},
                background: this.rexUI.add.roundRectangle({color: COLOR_PRIMARY}),
                text: this.add.text(0, 0, 'Footer', {fontSize: 20})
            }),

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                panel: 3,
                header: 5,
                footer: 5
            }
        })
            .layout()

    }

    update() {
    }
}

// var CreateContent = function (linesCount) {
//     var numbers = [];
//     for (var i = 0; i < linesCount; i++) {
//         numbers.push(i.toString());
//     }
//     return numbers.join('\n');
// }

const createPanel = function (scene: SampleScene) {
    const panel = scene.rexUI.add.sizer({
        orientation: 'y',
        space: {item: 5}
    })

    for (let i = 0; i < 20; i++) {
        const background = scene.rexUI.add.roundRectangle({
            x: 0, y: 0,
            width: 200, height: 60,
            color: COLOR_DARK, strokeColor: COLOR_LIGHT,
            radius: 10,
        });
        const text = scene.add.text(-90, -10, i.toString())
        const button = scene.add.text(65, -10, 'BTN')
            .setInteractive()
            .on('pointerup', function () {
                scene.print.text += `Click item ${i}\n`
            })
        const child = scene.add.container()
            .setSize(200, 60)
            .add([background, text, button])

        panel.add(child)
    }

    return panel;
}


export default SampleScene;
