export class StatisticsManager {
  private readonly entries: Record<string, number> = {};

  add(entryName: string, value: number) {
    if (!this.entries[entryName]) {
      this.entries[entryName] = 0;
    }
    this.entries[entryName] += value;
    return this;
  }
}
