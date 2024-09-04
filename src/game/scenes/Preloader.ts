import {Scene} from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        //  We loaded this image in our Boot Scene, so we can display it here

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(x, y, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(x - 230, y, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('star', 'star.png');

        this.load.image('arrow', 'arrow.png');
        this.load.image('enemy', 'enemy.png');

        this.load.spritesheet('hero', 'hero/running.png', {
            frameWidth: 64,  // Width of each frame in the spritesheet
            frameHeight: 64  // Height of each frame in the spritesheet
        });

        for (let i = 1; i <= 6; i++) {
            this.load.image(`skeleton_walk_${i}`, `enemy/skeleton/walk_${i}.png`);
            this.load.image(`skeleton_attack_${i}`, `enemy/skeleton/attack1_${i}.png`);
            this.load.image(`imp_walk_${i}`, `enemy/imp/walk_${i}.png`);
            this.load.image(`imp_attack_${i}`, `enemy/imp/attack1_${i}.png`);
            this.load.image(`demon_walk_${i}`, `enemy/demon/walk_${i}.png`);
            this.load.image(`demon_attack_${i}`, `enemy/demon/attack1_${i}.png`);
        }
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        this.registerAnimations();

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }

    private registerAnimations() {
        // Define the idle animation
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('hero', {start: 0, end: 1}), // Adjust start and end based on your spritesheet
            frameRate: 5,  // Animation speed
            repeat: -1      // Repeat indefinitely
        });

        // Define the running animation
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('hero', {start: 8, end: 15}), // Adjust start and end based on your spritesheet
            frameRate: 5,  // Animation speed
            repeat: -1      // Repeat indefinitely
        });

        // Create an animation using the custom texture
        this.anims.create({
            key: 'skeleton_walk',
            frames: Array.from({length: 6}, (_, i) => ({key: `skeleton_walk_${i + 1}`, frame: 0})),
            frameRate: 10,
            repeat: -1
        });

        // Create an animation using the custom texture
        this.anims.create({
            key: 'skeleton_attack',
            frames: Array.from({length: 6}, (_, i) => ({key: `skeleton_attack_${i + 1}`, frame: 0})),
            frameRate: 10,
            repeat: -1
        });

        // Create an animation using the custom texture
        this.anims.create({
            key: 'imp_walk',
            frames: Array.from({length: 6}, (_, i) => ({key: `imp_walk_${i + 1}`, frame: 0})),
            frameRate: 10,
            repeat: -1
        });

        // Create an animation using the custom texture
        this.anims.create({
            key: 'imp_attack',
            frames: Array.from({length: 6}, (_, i) => ({key: `imp_attack_${i + 1}`, frame: 0})),
            frameRate: 10,
            repeat: -1
        });

        // Create an animation using the custom texture
        this.anims.create({
            key: 'demon_walk',
            frames: Array.from({length: 6}, (_, i) => ({key: `demon_walk_${i + 1}`, frame: 0})),
            frameRate: 10,
            repeat: -1
        });

        // Create an animation using the custom texture
        this.anims.create({
            key: 'demon_attack',
            frames: Array.from({length: 6}, (_, i) => ({key: `demon_attack_${i + 1}`, frame: 0})),
            frameRate: 10,
            repeat: -1
        });
    }
}
