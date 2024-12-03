import {HEX_COLOR_DANGER, HEX_COLOR_DARK, HEX_COLOR_LIGHT, HEX_COLOR_SUCCESS} from '../helpers/colors.ts';
import {getScrollableUIConfig} from '../helpers/ui-helper.ts';
import Rectangle = Phaser.GameObjects.Rectangle;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {VectorZeroes} from '../helpers/position-helper.ts';

type SettingKey = 'debugMode' | 'autoAttack';

class SettingsScene extends Phaser.Scene {
    private debugMode: boolean = false;
    private autoAttack: boolean = false;

    constructor() {
        super('SettingsScene')
    }

    create() {
        this.loadStoredSettingsValues();
        this.rexUI.add.scrollablePanel(getScrollableUIConfig(this, 'Settings'))
            .layout()

    }

    createPanel() {
        const panel = this.rexUI.add.sizer({orientation: 'y', space: {item: 5}})

        panel.add(this.addSettingsRow('debugMode', 'Debug Mode', {x: 40, y: -5}, VectorZeroes()));
        panel.add(this.addSettingsRow('autoAttack', 'Auto Attack', {x: 40, y: -5}, VectorZeroes()));
        // panel.add(this._createAutoAttackCheckbox());

        return panel;
    }

    private addSettingsRow(settingKey: SettingKey, label: string, textOffset: Vector2Like, checkboxOffset: Vector2Like) {
        const checkbox: Rectangle = this.add.rectangle(checkboxOffset.x, checkboxOffset.y, 20, 20, this[settingKey] ? HEX_COLOR_SUCCESS : HEX_COLOR_DANGER)
            .setInteractive();

        checkbox.on('pointerdown', () => this.updateBoolVal(settingKey, checkbox));
        const text = this.add.text(textOffset.x, textOffset.y, label).setInteractive().on('pointerup', () => this.updateBoolVal(settingKey, checkbox));
        // Toggle debug mode when clicking the checkbox
        const width = this.scale.width - 200;
        const background = this.rexUI.add.roundRectangle({
            x: 0,
            y: 0,
            width,
            height: 60,
            color: HEX_COLOR_DARK,
            strokeColor: HEX_COLOR_LIGHT,
            radius: 10
        });
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
        cb.setFillStyle(this[settingKey] ? HEX_COLOR_SUCCESS : HEX_COLOR_DANGER);
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
