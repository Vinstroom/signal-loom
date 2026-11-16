import { EventEmitter } from 'events';
import { SignatureError } from './signatureError';

/**
 * The EventEmitter for signature verification events.
 */
export class SignatureEmitter extends EventEmitter {
  /**
   * Emits 'signatureVerified' event with the verified signature.
   * @param signatureVerified - The verified signature.
   */
  emitSignatureVerified(signatureVerified: string): boolean {
    return this.emit('signatureVerified', signatureVerified);
  }

  /**
   * Emits 'signatureVerificationFailed' event with the error.
   * @param error - The signature verification error.
   */
  emitSignatureVerificationFailed(error: SignatureError): boolean {
    return this.emit('signatureVerificationFailed', error);
  }
}
