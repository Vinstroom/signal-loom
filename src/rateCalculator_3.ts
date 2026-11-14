/**
 * Calculates the rate and throughput based on given events using a sliding time window.
 */
export class RateCalculator {
  private readonly windowSeconds: number;
  private eventCount = 0;
  private totalBytes = 0;
  private startTime: number;

  constructor(windowSeconds = 60) {
    this.windowSeconds = windowSeconds;
    this.resetWindow();
  }

  /**
   * Reset the calculator's window to start a new window.
   * @private
   */
  private resetWindow(): void {
    this.startTime = Date.now();
    this.eventCount = 0;
    this.totalBytes = 0;
  }

  /**
   * Increment the event count and total bytes for an event with the given size.
   * @param size - Size of the event in bytes.
   */
  public increment(size: number): void {
    this.eventCount++;
    this.totalBytes += size;

    const now = Date.now();
    if (now - this.startTime >= this.windowSeconds * 1000) {
      this.resetWindow();
    }
  }

  /**
   * Get the current rate in events per second.
   */
  public getEventRate(): number {
    const elapsedSeconds = (Date.now() - this.startTime) / 1000;
    return Math.floor(this.eventCount / elapsedSeconds);
  }

  /**
   * Get the current throughput in bytes per second.
   */
  public getThroughput(): number {
    const elapsedSeconds = (Date.now() - this.startTime) / 1000;
    return Math.floor(this.totalBytes / elapsedSeconds);
  }
}
