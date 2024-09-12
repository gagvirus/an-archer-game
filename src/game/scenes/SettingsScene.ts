import {GameObjects} from "phaser";
import {createCenteredText} from "../helpers/text-helpers.ts";
import {COLOR_DANGER, COLOR_SUCCESS} from '../helpers/colors.ts';

class SettingsScene extends Phaser.Scene {
    private debugMode: boolean = false;
    private autoAttack: boolean = false;
    backToMainMenuText: Phaser.GameObjects.Text;
    titleText: GameObjects.Text;
    debugModeCheckbox: GameObjects.Rectangle;
    autoAttackCheckbox: GameObjects.Rectangle;

    constructor() {
        super({key: 'SettingsScene'});
    }

    preload() {
        // Preload any assets if necessary
    }

    create() {
        this.titleText = createCenteredText(this, 'Settings', -200, 38, false);

        this.debugMode = this.game.registry.get('debugMode') == 'true';
        this.autoAttack = this.game.registry.get('autoAttack') == 'true';

        // Add text label
        createCenteredText(this, 'Debug Mode', 0, 32, true, () => this.updateDebugMode());
        createCenteredText(this, 'Auto-Attack', 50, 32, true, () => this.updateAutoAttack());

        // Create checkbox (simply represented by a rectangle for now)
        this.debugModeCheckbox = this.add.rectangle(this.scale.width / 2 + 150, this.scale.height / 2, 20, 20, this.debugMode ? COLOR_SUCCESS : COLOR_DANGER)
            .setInteractive().setOrigin(0.5);
        // Toggle debug mode when clicking the checkbox
        this.debugModeCheckbox.on('pointerdown', () => this.updateDebugMode());

        // Create checkbox (simply represented by a rectangle for now)
        this.autoAttackCheckbox = this.add.rectangle(this.scale.width / 2 + 150, this.scale.height / 2 + 50, 20, 20, this.autoAttack ? COLOR_SUCCESS : COLOR_DANGER)
            .setInteractive().setOrigin(0.5);
        // Toggle debug mode when clicking the checkbox
        this.autoAttackCheckbox.on('pointerdown', () => this.updateAutoAttack());

        // Button to return to the main scene
        this.backToMainMenuText = createCenteredText(this, 'Back to Main Menu', 100, 32, true, () => {
            this.scene.start('MainMenu');
        });
    }

    updateDebugMode() {
        this.debugMode = !this.debugMode;
        this.debugModeCheckbox.setFillStyle(this.debugMode ? COLOR_SUCCESS : COLOR_DANGER);
        // Persist the setting to localStorage
        localStorage.setItem('debugMode', this.debugMode.toString());
        // You can also update global game variables if necessary, for example:
        this.game.registry.set('debugMode', this.debugMode.toString());
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

export default SettingsScene;
