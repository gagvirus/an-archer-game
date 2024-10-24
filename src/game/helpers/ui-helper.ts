import {COLOR_DARK, COLOR_LIGHT, COLOR_PRIMARY} from './colors.ts';
import {Scene} from 'phaser';
import ScrollablePanel from 'phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel';
import GameObject = Phaser.GameObjects.GameObject;
import IConfig = ScrollablePanel.IConfig;

interface SceneWithPanel extends Scene {
    createPanel: () => GameObject;
}


const getScrollableUIConfig = (scene: SceneWithPanel, label: string): IConfig => {
    return {
        x: scene.scale.width / 2,
        y: scene.scale.height / 2,
        height: scene.scale.height - 100,
        scrollMode: 'y',
        background: scene.rexUI.add.roundRectangle({
            strokeColor: COLOR_LIGHT,
            color: COLOR_PRIMARY,
            radius: 10
        }),

        panel: {
            child: scene.createPanel(),

            mask: {padding: 1,},
        },

        slider: {
            track: scene.rexUI.add.roundRectangle({radius: 5, color: COLOR_DARK}),
            thumb: scene.rexUI.add.roundRectangle({width: 20, height: 40, radius: 10, color: COLOR_LIGHT})
        },

        mouseWheelScroller: {
            focus: false,
            speed: 0.1
        },

        header: scene.rexUI.add.label({
            space: {left: 5, right: 5, top: 5, bottom: 15},
            background: scene.rexUI.add.roundRectangle({color: COLOR_PRIMARY}),
            text: scene.add.text(0, 0, label, {fontSize: 20}),
            align: 'center',
        }),

        footer: scene.rexUI.add.label({
            space: {left: 5, right: 5, top: 5, bottom: 5},
            background: scene.rexUI.add.roundRectangle({color: COLOR_PRIMARY}),
            text: scene.add.text(0, 0, 'Go Back', {fontSize: 20})
                .setInteractive()
                .on('pointerup', () => {
                    scene.scene.start('MainMenu');
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
    }
}

export {getScrollableUIConfig}
