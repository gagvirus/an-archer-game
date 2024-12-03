import Vector2Like = Phaser.Types.Math.Vector2Like;
import {HEX_COLOR_DANGER, HEX_COLOR_SUCCESS} from '../helpers/colors.ts';
import {formatNumber} from '../helpers/text-helpers.ts';
import {VectorZeroes} from '../helpers/position-helper.ts';

abstract class Bar {
    scene: Phaser.Scene;
    position: Vector2Like;
    positionOffset: Vector2Like;
    width: number;
    height: number;
    bar: Phaser.GameObjects.Graphics;
    text: Phaser.GameObjects.Text;
    maxValue: number;
    currentValue: number;
    filledColor: number;
    emptyColor: number;

    protected constructor(scene: Phaser.Scene, position: Vector2Like, width: number, height: number, maxValue: number, currentValue: number, positionOffset?: Vector2Like, filledColor?: number, emptyColor?: number, displayText: boolean = false) {
        this.scene = scene;
        this.position = position
        this.width = width;
        this.height = height;
        this.maxValue = maxValue;
        this.currentValue = currentValue;
        this.positionOffset = positionOffset ?? VectorZeroes();
        this.filledColor = filledColor ?? HEX_COLOR_SUCCESS;
        this.emptyColor = emptyColor ?? HEX_COLOR_DANGER;
        this.bar = this.scene.add.graphics();

        if (displayText) {
            this.text = scene.add.text(position.x, position.y, '', {
                fontFamily: 'Arial Black',
                fontSize: 12,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center',
            }).setFixedSize(width, height)
        }

        this.draw();
    }

    // Draw the bar
    draw() {
        this.bar.clear();

        // Draw background (red bar)
        this.bar.fillStyle(this.emptyColor);
        this.bar.fillRect(this.position.x + this.positionOffset.x, this.position.y + this.positionOffset.y, this.width, this.height);

        // Calculate the percentage
        const currentValueWidth = (this.currentValue / this.maxValue) * this.width;

        // Draw filled (green bar)
        if (currentValueWidth > 0) {
            this.bar.fillStyle(this.filledColor);
            this.bar.fillRect(this.position.x + this.positionOffset.x, this.position.y + this.positionOffset.y, currentValueWidth, this.height);
        }

        if (this.text) {
            this.text.setText(this.formatText());
        }
    }

    // Update the bar with the new current value
    updateBar(newValue: number, maxValue?: number) {
        this.currentValue = newValue;
        if (maxValue)
        {
            this.maxValue = maxValue;
        }
        this.draw();
    }

    destroy() {
        this.bar.destroy();
    }

    formatText() {
        const from = formatNumber(this.currentValue);
        const to = formatNumber(this.maxValue);
        return `${from}/${to}`;
    }
}

export default Bar;
