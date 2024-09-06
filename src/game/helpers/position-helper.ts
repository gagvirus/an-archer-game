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

// takes a real pointer position, divides it by tiles size and returns the center coordinate
// so it will "snap to grid"
const dampPosition = (position: Vector2, tileSize: number): Vector2 => 
{
    return {
        x: Math.floor(position.x / tileSize) * tileSize + tileSize / 2,
        y: Math.floor(position.y / tileSize) * tileSize + tileSize / 2,
    };
    
}

export {getRandomPosition, getRandomPositionAwayFromPoint, dampPosition}
