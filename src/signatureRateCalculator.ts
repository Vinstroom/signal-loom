// src/signatureRateCalculator.ts

export class SignatureRateCalculator {
  private _count = 0;
  private _lastResetTime = 0;

  constructor(private readonly intervalInMs: number) {
    this._lastResetTime = Date.now();
  }

  public process(): void {
    const now = Date.now();
    const elapsedTimeMs = now - this._lastResetTime;
    if (elapsedTimeMs >= this.intervalInMs) {
      this.reset();
    }
    this._count++;
  }

  public get ratePerSecond(): number {
    const now = Date.now();
    const elapsedTimeMs = now - this._lastResetTime;
    return this._count * 1000 / elapsedTimeMs;
  }

  private reset(): void {
    this._count = 0;
    this._lastResetTime = Date.now();
  }
}
