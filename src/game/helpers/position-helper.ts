const getRandomPosition =
    (maxX: number, maxY: number) => {
        const x = Phaser.Math.Between(50, maxX - 50);
        const y = Phaser.Math.Between(50, maxY - 50);
        return {x, y};
    }

export {getRandomPosition}