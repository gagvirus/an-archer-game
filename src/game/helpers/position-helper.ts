export interface Vector2 {
    x: number;
    y: number;
}

const getRandomPosition = (maxX: number, maxY: number): Vector2 => {
    const x = Phaser.Math.Between(50, maxX - 50);
    const y = Phaser.Math.Between(50, maxY - 50);
    return {x, y};
}

const getRandomPositionAwayFromPoint = (maxX: number, maxY: number, awayFrom: Vector2, minDistance: number): Vector2 => {
    const {x, y} = getRandomPosition(maxX, maxY);
    const distance = Phaser.Math.Distance.Between(awayFrom.x, awayFrom.y, x, y);
    if (distance < minDistance) {
        return getRandomPositionAwayFromPoint(maxX, maxY, awayFrom, minDistance)
    }
    return {x, y}
}

export {getRandomPosition, getRandomPositionAwayFromPoint}
