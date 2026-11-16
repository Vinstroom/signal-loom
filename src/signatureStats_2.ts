/**
 * Signature verification statistics.
 */
export interface SignatureStats {
  /**
   * Total number of signature verifications attempted.
   */
  verificationsAttempted: number;

  /**
   * Total number of signature verifications that passed.
   */
  verificationsPassed: number;

  /**
   * Total number of signature verifications that failed.
   */
  verificationsFailed: number;
}

/**
 * Initializes signature verification statistics.
 */
export function initSignatureStats(): SignatureStats {
  return {
    verificationsAttempted: 0,
    verificationsPassed: 0,
    verificationsFailed: 0,
  };
}

/**
 * Updates signature verification statistics.
 * @param stats Existing statistics.
 * @param result Result of signature verification.
 */
export function updateSignatureStats(stats: SignatureStats, result: boolean): SignatureStats {
  const updatedStats = { ...stats };
  updatedStats.verificationsAttempted++;

  if (result) {
    updatedStats.verificationsPassed++;
  } else {
    updatedStats.verificationsFailed++;
  }

  return updatedStats;
}
