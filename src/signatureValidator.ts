import { Request } from 'express';
import { verify } from 'crypto';
import { SignatureError } from './signatureError';
import { SignatureRateCalculator } from './signatureRateCalculator';
import { SignatureScoring } from './signatureScoring';
import { SignatureStats } from './signatureStats_3';

/**
 * Validates the signature of an incoming webhook or event stream.
 * @param req - Express request object containing the signature.
 * @param rateCalculator - Instance of SignatureRateCalculator.
 * @param scaler - Instance of SignatureScoring.
 * @param stats - Instance of SignatureStats.
 * @returns Promise that resolves if signature is valid, rejects with SignatureError if invalid.
 */
export async function validateSignature(
  req: Request,
  rateCalculator: SignatureRateCalculator,
  scaler: SignatureScoring,
  stats: SignatureStats
): Promise<void> {
  const signature = req.headers['x-signature'] as string;
  const timestamp = req.headers['x-timestamp'] as string;

  if (!signature || !timestamp) {
    throw new SignatureError('Missing signature or timestamp');
  }

  const isValid = verify(timestamp, signature, 'secret-key'); // Replace 'secret-key' with your actual secret key.

  if (!isValid) {
    throw new SignatureError('Invalid signature');
  }

  const rateResult = await rateCalculator.calculate(timestamp);

  if (!rateResult.isAllowed) {
    throw new SignatureError('Signature rate limit exceeded');
  }

  const scoreResult = await scaler.score(signature, timestamp);

  if (!scoreResult.isAllowed) {
    throw new SignatureError('Signature score limit exceeded');
  }

  stats.incrementValidSignature();
}

/**
 * Middleware function that wraps validateSignature.
 * @param rateCalculator - Instance of SignatureRateCalculator.
 * @param scaler - Instance of SignatureScoring.
 * @param stats - Instance of SignatureStats.
 * @returns Express middleware function.
 */
export function signatureValidationMiddleware(
  rateCalculator: SignatureRateCalculator,
  scaler: SignatureScoring,
  stats: SignatureStats
) {
  return async (req: Request, res: Response, next: () => void) => {
    try {
      await validateSignature(req, rateCalculator, scaler, stats);
      next();
    } catch (err) {
      if (err instanceof SignatureError) {
        res.status(401).send(err.message);
      } else {
        res.status(500).send('Server error');
      }
    }
  };
}
