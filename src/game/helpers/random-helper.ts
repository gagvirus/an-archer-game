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

export {getRandomItem}