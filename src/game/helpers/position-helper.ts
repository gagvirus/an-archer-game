import Vector2Like = Phaser.Types.Math.Vector2Like;

const getRandomPosition = (maxX: number, maxY: number): Vector2Like => {
    const x = Phaser.Math.Between(50, maxX - 50);
    const y = Phaser.Math.Between(50, maxY - 50);
    return {x, y};
}

const getRandomPositionAwayFromPoint = (maxX: number, maxY: number, awayFrom: Vector2Like, minDistance: number): Vector2Like => {
    const {x, y} = getRandomPosition(maxX, maxY);
    const distance = Phaser.Math.Distance.Between(awayFrom.x, awayFrom.y, x, y);
    if (distance < minDistance) {
        return getRandomPositionAwayFromPoint(maxX, maxY, awayFrom, minDistance)
    }
    return {x, y}
}

// takes a real pointer position, divides it by tiles size and returns the center coordinate
// so it will "snap to grid"
const dampPosition = (position: Vector2Like, tileSize: number): Vector2Like => 
{
    return {
        x: Math.floor(position.x / tileSize) * tileSize + tileSize / 2,
        y: Math.floor(position.y / tileSize) * tileSize + tileSize / 2,
    };
}

const getTileCoordinate = (position: Vector2Like, tileSize: number): Vector2Like => {
    return {
        x: Math.floor(position.x / tileSize),
        y: Math.floor(position.y / tileSize),
    }
}

export {getRandomPosition, getRandomPositionAwayFromPoint, dampPosition, getTileCoordinate}
