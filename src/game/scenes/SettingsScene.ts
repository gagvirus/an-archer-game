class SettingsScene extends Phaser.Scene {
    private debugMode: boolean = false;
    backButton: Phaser.GameObjects.Text;

    constructor() {
        super({key: 'SettingsScene'});
    }

    preload() {
        // Preload any assets if necessary
    }

    create() {
        this.debugMode = this.game.registry.get('debugMode') == 'true';

        // Add text label
        this.add.text(100, 100, 'Enable Debug Mode:', {fontSize: '20px', color: '#ffffff'});

        // Create checkbox (simply represented by a rectangle for now)
        const checkbox = this.add.rectangle(300, 110, 20, 20, this.debugMode ? 0x00ff00 : 0xff0000)
            .setInteractive();

        // Toggle debug mode when clicking the checkbox
        checkbox.on('pointerdown', () => {
            this.debugMode = !this.debugMode;
            checkbox.setFillStyle(this.debugMode ? 0x00ff00 : 0xff0000); // Change color
            this.updateDebugMode();
        });

        // Button to return to the main scene
        this.backButton = this.add.text(100, 200, 'Back to Main Menu', {fontSize: '20px', color: '#ffffff'})
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });
    }

    updateDebugMode() {
        // Persist the setting to localStorage
        localStorage.setItem('debugMode', this.debugMode.toString());
        // You can also update global game variables if necessary, for example:
        this.game.registry.set('debugMode', this.debugMode.toString());
    }
}

export default SettingsScene;