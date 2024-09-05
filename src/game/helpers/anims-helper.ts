const getPingPongAnimationFrames = (start: number, end: number, repeatMiddleFrames: number = 0): number[] => {
    const middleFrames = [];
    for (let i = 0; i < repeatMiddleFrames; i++) {
        middleFrames.push(end);
    }
    return [
        ...Phaser.Utils.Array.NumberArray(start, end),  // Frames 1 to 10
        ...middleFrames,
        ...Phaser.Utils.Array.NumberArray(end, start),   // Frames 9 to 2 (reversing)
    ] as number[];
}

export {getPingPongAnimationFrames}