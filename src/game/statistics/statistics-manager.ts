const key = "STATISTICS";

export class StatisticsManager {
  private static instance: StatisticsManager;
  private readonly entries: Record<string, number> = {};

  private constructor() {
    this.entries = this.readGlobalStatistics();
  }

  static getInstance() {
    if (!StatisticsManager.instance) {
      StatisticsManager.instance = new StatisticsManager();
    }
    return StatisticsManager.instance;
  }

  add(entryName: string, value: number) {
    if (!this.entries[entryName]) {
      this.entries[entryName] = 0;
    }
    this.entries[entryName] += value;
    return this;
  }

  retrieve(entryName: string) {
    return this.entries[entryName] ?? 0;
  }

  addScore(amount: number) {
    this.add("score", amount);
  }

  getScore() {
    return this.retrieve("score");
  }

  resetLocalStatistics() {
    Object.keys(this.entries).forEach((entryKey) => {
      if (!entryKey.startsWith("global")) {
        this.add(`global.${entryKey}`, this.entries[entryKey]);
        delete this.entries[entryKey];
      }
    });
    this.writeGlobalStatistics();
  }

  writeGlobalStatistics() {
    const filteredData: Record<string, number> = {};
    Object.keys(this.entries).forEach((statKey) => {
      if (statKey.startsWith("global")) {
        filteredData[statKey] = this.entries[statKey];
      }
    });
    localStorage.setItem(key, JSON.stringify(filteredData));
  }

  readGlobalStatistics() {
    const rawData = localStorage.getItem(key);
    let data = {};
    if (rawData) {
      try {
        data = JSON.parse(rawData);
      } catch (SyntaxError) {
        console.warn("couldn't parse statistics data from localStorage");
      }
    }
    return data;
  }
}
