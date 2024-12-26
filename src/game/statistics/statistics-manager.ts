export class StatisticsManager {
  private static instance: StatisticsManager;
  private readonly entries: Record<string, number> = {};

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
  }
}
