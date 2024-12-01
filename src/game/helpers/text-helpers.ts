import {GameObjects, Scene} from 'phaser';
import Vector2Like = Phaser.Types.Math.Vector2Like;
import TextStyle = Phaser.Types.GameObjects.Text.TextStyle;

const createText = (scene: Scene, text: string, position: Vector2Like, fontSize: number = 32, align: string = 'center', defaultStroke: boolean = true): GameObjects.Text => {
    let textConfig: TextStyle = {
        fontFamily: 'Arial Black',
        fontSize,
        color: '#ffffff',
        align,
    };
    if (defaultStroke) {
        textConfig = {
            ...textConfig,
            stroke: '#000000',
            strokeThickness: Math.floor(fontSize / 4)
        }
    }
    return scene.add.text(position.x, position.y, text, textConfig).setOrigin(0.5).setDepth(100)
}

const createCenteredText = (scene: Scene, text: string, verticalOffset: number = 0, fontSize: number = 32, isInteractive: boolean = false, onClick?: () => void) => {
    const textObject = createText(scene, text, {
        x: scene.scale.width / 2,
        y: scene.scale.height / 2 + verticalOffset
    }, fontSize)

    if (isInteractive) {
        textObject.setInteractive();
        if (onClick) {
            textObject.on('pointerdown', onClick);
        }
    }

    return textObject
}

const createAnimatedText = (scene: Scene, text: string, duration: number) => {
    const screenWidth = scene.scale.width;
    const screenHeight = scene.scale.height;

    // Create the text at the bottom of the screen
    const animatedText = createText(scene, text, {x: screenWidth / 2, y: screenHeight}, 48)

    // Animate the text to move up to the middle of the screen
    scene.tweens.add({
        targets: animatedText,
        y: screenHeight / 2,
        duration: 1000, // 1 second duration to move up
        ease: 'Power2',
    });

    // Fade out the text after a delay
    scene.time.delayedCall(duration, () => {
        scene.tweens.add({
            targets: animatedText,
            alpha: 0,
            duration: 1000, // 1 second duration to fade out
            onComplete: () => {
                animatedText.destroy(); // Destroy the text after fading out
            }
        });
    });

    return animatedText;
}

function formatNumber(value: number) {
    value = Math.floor(value);
    if (value >= 1_000_000_000_000) {
        return (value / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 't';
    } else if (value >= 1_000_000_000) {
        return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'b';
    } else if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
    } else if (value >= 1_000) {
        return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
        return value.toString();
    }
}

export {createCenteredText, createAnimatedText, createText, formatNumber};
