/**
 * SignatureStats keeps track of signature verification statistics.
 */
export class SignatureStats {
  private signatureVerifications: number;
  private signatureVerificationSuccess: number;
  private signatureVerificationFailures: number;

  constructor() {
    this.signatureVerifications = 0;
    this.signatureVerificationSuccess = 0;
    this.signatureVerificationFailures = 0;
  }

  /**
   * Records a successful signature verification.
   */
  recordSuccess(): void {
    this.signatureVerifications++;
    this.signatureVerificationSuccess++;
  }

  /**
   * Records a failed signature verification.
   */
  recordFailure(): void {
    this.signatureVerifications++;
    this.signatureVerificationFailures++;
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
}
