interface Item {
    weight: number
}

const getRandomItem = <T extends Item>(listOfItems: T[]): T => {
    // Calculate the total weight
    const totalWeight = listOfItems.reduce((sum, item) => sum + item.weight, 0);

    // Generate a random number within the total weight
    const randomNum = Math.random() * totalWeight;

    // Determine which item corresponds to the random number
    let cumulativeWeight = 0;
    for (const item of listOfItems) {
        cumulativeWeight += item.weight;
        if (randomNum < cumulativeWeight) {
            return item;
        }
    }

    // Fallback in case of rounding errors
    return listOfItems[0];
}

const getRandomNumberBetweenRange = (range: [number, number]): number => {
    return getRandomNumberBetween(range[0], range[1]);
}

const getRandomNumberBetween = (a: number, b: number): number => {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return Math.random() * (max - min) + min;
}

export {getRandomItem, getRandomNumberBetween, getRandomNumberBetweenRange}
