import Bar from './Bar.ts';
import {COLOR_GREY, COLOR_WARNING} from '../helpers/colors.ts';
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {formatNumber} from '../helpers/text-helpers.ts';

class XpBar extends Bar {
    level: number;
    text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, position: Vector2Like, width: number, height: number, level: number, currentXp: number, xpToNextLevel: number, positionOffset?: Vector2Like) {
        super(scene, position, width, height, xpToNextLevel, currentXp, positionOffset, COLOR_WARNING, COLOR_GREY)
        this.level = level;
        console.log(this.bar.x, this.bar.y)
        this.text = scene.add.text(position.x, position.y, '', {
            fontFamily: 'Arial Black',
            fontSize: 12,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
            // backgroundColor: '#000',
        }).setFixedSize(width, height)
    }

    draw() {
        super.draw();
        this.writeLevelInfo();
    }

    writeLevelInfo() {
        const from = formatNumber(this.currentValue);
        const to = formatNumber(this.maxValue);
        const levelInfo = `Level ${this.level} (${from}/${to})`
        this.text?.setText(levelInfo);
    }
}

export default XpBar;
