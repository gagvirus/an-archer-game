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
  return Math.ceil(Math.random() * (max - min) + min);
}

/**
 * Returns a random boolean value based on the probability of getting a true
 * Useful for example in determining isCritical
 * @param trueProbability
 * @param maxProbability
 */
const randomChance = (trueProbability: number, maxProbability: number = 95): boolean => {
  // the crit chance could be 0.2 - for handling such precision, let's multiply everything by 10
  trueProbability = Phaser.Math.Clamp(trueProbability * 10, 0, maxProbability * 10);
  // Generate a random number between 0 and 100
  const roll = Phaser.Math.Between(0, 1000);
  // Return true if the roll is less than the trueProbability
  return roll < trueProbability;
}

export {getRandomItem, getRandomNumberBetween, getRandomNumberBetweenRange, randomChance}
