import {COLOR_DANGER, COLOR_DARK, COLOR_LIGHT, COLOR_PRIMARY, COLOR_SUCCESS} from '../helpers/colors.ts';
import Rectangle = Phaser.GameObjects.Rectangle;

class SampleScene extends Phaser.Scene {
    private debugMode: boolean = false;
    private autoAttack: boolean = false;
    autoAttackCheckbox: Rectangle;

    constructor() {
        super('SampleScene')
    }

    create() {
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
                child: this._createPanel(),

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

    _createPanel() {
        const panel = this.rexUI.add.sizer({orientation: 'y', space: {item: 5}})

        panel.add(this._createDebugModeCheckbox());
        // panel.add(this._createAutoAttackCheckbox());

        return panel;
    }

    private _createDebugModeCheckbox() {
        const update = (cb: Rectangle) => {
            this.debugMode = !this.debugMode;
            cb.setFillStyle(this.debugMode ? COLOR_SUCCESS : COLOR_DANGER);
            // Persist the setting to localStorage
            localStorage.setItem('debugMode', this.debugMode.toString());
            // You can also update global game variables if necessary, for example:
            this.game.registry.set('debugMode', this.debugMode.toString());
        }
        const checkbox: Rectangle = this.add.rectangle(0, 0, 20, 20, this.debugMode ? COLOR_SUCCESS : COLOR_DANGER)
            .setInteractive();

        checkbox.on('pointerdown', () => update(checkbox));
        const text = this.add.text(0, 0, 'Debug Mode').setInteractive().on('pointerup', () => update(checkbox));
        // Toggle debug mode when clicking the checkbox
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
        return this.add.container()
            .setSize(width, 60)
            .add([
                background,
                text,
                checkbox,
            ])
    }

    updateAutoAttack() {
        this.autoAttack = !this.autoAttack;
        this.autoAttackCheckbox.setFillStyle(this.autoAttack ? COLOR_SUCCESS : COLOR_DANGER);
        // Persist the setting to localStorage
        localStorage.setItem('autoAttack', this.autoAttack.toString());
        // You can also update global game variables if necessary, for example:
        this.game.registry.set('autoAttack', this.autoAttack.toString());
    }
}

export default SampleScene;
