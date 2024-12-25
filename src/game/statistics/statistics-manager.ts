export class StatisticsManager {
  private readonly entries: Record<string, number> = {};
  private static instance: StatisticsManager;

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
        delete this.entries[entryKey];
      }
    });
  }
}
