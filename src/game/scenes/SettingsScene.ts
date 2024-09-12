import {COLOR_DANGER, COLOR_DARK, COLOR_LIGHT, COLOR_PRIMARY, COLOR_SUCCESS} from '../helpers/colors.ts';
import Rectangle = Phaser.GameObjects.Rectangle;
import Vector2Like = Phaser.Types.Math.Vector2Like;

type SettingKey = 'debugMode' | 'autoAttack';

class SettingsScene extends Phaser.Scene {
    private debugMode: boolean = false;
    private autoAttack: boolean = false;

    constructor() {
        super('SettingsScene')
    }

    create() {
        this.loadStoredSettingsValues();
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
                        this.scene.start('MainMenu');
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

        panel.add(this.addSettingsRow('debugMode', 'Debug Mode', {x: 40, y: -5}, {x: 0, y: 0}));
        panel.add(this.addSettingsRow('autoAttack', 'Auto Attack', {x: 40, y: -5}, {x: 0, y: 0}));
        // panel.add(this._createAutoAttackCheckbox());

        return panel;
    }

    private addSettingsRow(settingKey: SettingKey, label: string, textOffset: Vector2Like, checkboxOffset: Vector2Like) {
        const checkbox: Rectangle = this.add.rectangle(checkboxOffset.x, checkboxOffset.y, 20, 20, this[settingKey] ? COLOR_SUCCESS : COLOR_DANGER)
            .setInteractive();

        checkbox.on('pointerdown', () => this.updateBoolVal(settingKey, checkbox));
        const text = this.add.text(textOffset.x, textOffset.y, label).setInteractive().on('pointerup', () => this.updateBoolVal(settingKey, checkbox));
        // Toggle debug mode when clicking the checkbox
        const width = this.scale.width - 200;
        const background = this.rexUI.add.roundRectangle({x: 0, y: 0, width, height: 60, color: COLOR_DARK, strokeColor: COLOR_LIGHT, radius: 10});
        return this.add.container()
            .setSize(width, 60)
            .add([
                background,
                text,
                checkbox,
            ])
    }

    updateBoolVal(settingKey: SettingKey, cb: Rectangle) {
        this[settingKey] = !this[settingKey];
        cb.setFillStyle(this[settingKey] ? COLOR_SUCCESS : COLOR_DANGER);
        // Persist the setting to localStorage
        localStorage.setItem(settingKey, this[settingKey].toString());
        // You can also update global game variables if necessary, for example:
        this.game.registry.set(settingKey, this[settingKey].toString());
    }

    private loadStoredSettingsValues() {
        this.debugMode = this.game.registry.get('debugMode') == 'true';
        this.autoAttack = this.game.registry.get('autoAttack') == 'true';
    }
}

export default SettingsScene;
