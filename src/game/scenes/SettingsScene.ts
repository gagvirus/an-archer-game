import {GameObjects} from "phaser";
import {createCenteredText} from "../helpers/text-helpers.ts";

class SettingsScene extends Phaser.Scene {
    private debugMode: boolean = false;
    backToMainMenuText: Phaser.GameObjects.Text;
    titleText: GameObjects.Text;
    checkbox: GameObjects.Rectangle;

    constructor() {
        super({key: 'SettingsScene'});
    }

    preload() {
        // Preload any assets if necessary
    }

    create() {
        this.titleText = createCenteredText(this, 'Settings', -200, 38, false);

        this.debugMode = this.game.registry.get('debugMode') == 'true';

        // Add text label
        createCenteredText(this, 'Debug Mode', 0, 32, true, () => this.updateDebugMode());

        // Create checkbox (simply represented by a rectangle for now)
        this.checkbox = this.add.rectangle(this.scale.width / 2 + 150, this.scale.height / 2, 20, 20, this.debugMode ? 0x00ff00 : 0xff0000)
            .setInteractive().setOrigin(0.5);

        // Toggle debug mode when clicking the checkbox
        this.checkbox.on('pointerdown', () => this.updateDebugMode());

        // Button to return to the main scene
        this.backToMainMenuText = createCenteredText(this, 'Back to Main Menu', 100, 32, true, () => {
            this.scene.start('MainMenu');
        });
    }

    updateDebugMode() {
        this.debugMode = !this.debugMode;
        this.checkbox.setFillStyle(this.debugMode ? 0x00ff00 : 0xff0000);
        // Persist the setting to localStorage
        localStorage.setItem('debugMode', this.debugMode.toString());
        // You can also update global game variables if necessary, for example:
        this.game.registry.set('debugMode', this.debugMode.toString());
    }
}

export default SettingsScene;