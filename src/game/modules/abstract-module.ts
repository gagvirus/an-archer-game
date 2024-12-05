abstract class AbstractModule {
    protected scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    abstract start(): void;

    abstract stop(): void;

    abstract update(): void;
}

export default AbstractModule;
