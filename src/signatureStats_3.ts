/**
 * SignatureStats keeps track of signature verification statistics and implements rate shaping and delivery logs.
 */
export class SignatureStats {
  private signatureVerifications: number;
  private signatureVerificationSuccess: number;
  private signatureVerificationFailures: number;
  private rateLimit: number;
  private rateLimitCounter: number;
  private deliveryLogs: { success: string[]; failure: string[] };

  constructor(rateLimit: number) {
    this.signatureVerifications = 0;
    this.signatureVerificationSuccess = 0;
    this.signatureVerificationFailures = 0;
    this.rateLimit = rateLimit;
    this.rateLimitCounter = 0;
    this.deliveryLogs = { success: [], failure: [] };
  }

  /**
   * Records a successful signature verification and updates rate limit counter and delivery log.
   */
  recordSuccess(payload: string): void {
    this.signatureVerifications++;
    this.signatureVerificationSuccess++;
    this.rateLimitCounter++;
    this.deliveryLogs.success.push(payload);
    this.checkRateLimit();
  }

  /**
   * Records a failed signature verification and updates rate limit counter and delivery log.
   */
  recordFailure(payload: string): void {
    this.signatureVerifications++;
    this.signatureVerificationFailures++;
    this.rateLimitCounter++;
    this.deliveryLogs.failure.push(payload);
    this.checkRateLimit();
  }

  /**
   * Retrieves the total number of signature verifications performed.
   */
  getTotal(): number {
    return this.signatureVerifications;
  }

  /**
   * Retrieves the number of successful signature verifications.
   */
  getSuccess(): number {
    return this.signatureVerificationSuccess;
  }

  /**
   * Retrieves the number of failed signature verifications.
   */
  getFailures(): number {
    return this.signatureVerificationFailures;
  }

  /**
   * Checks the rate limit and throttles the processing if needed.
   */
  private checkRateLimit(): void {
    if (this.rateLimitCounter >= this.rateLimit) {
      this.rateLimitCounter = 0;
      throw new Error('Rate limit exceeded');
    }
  }

  /**
   * iterator or generator utility for rate shaping and delivery logs.
   */
  *logIterator(): Generator<string, void, unknown> {
    while (this.deliveryLogs.success.length > 0 || this.deliveryLogs.failure.length > 0) {
      if (this.deliveryLogs.success.length > 0) {
        yield this.deliveryLogs.success.shift();
      }
      if (this.deliveryLogs.failure.length > 0) {
        yield this.deliveryLogs.failure.shift();
      }
    }
  }
}
