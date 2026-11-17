import { EventEmitter } from 'events';
import { SignableEvent } from './index';
import { SignatureError, SignatureScoring } from './signature';

type SignatureState = 'unauthorized' | 'valid' | 'invalid';

export class SignatureStateMachine extends EventEmitter {
  private state: SignatureState = 'unauthorized';
  private signature?: string;

  public setSignature(signature: string): void {
    this.signature = signature;
    this.emit('stateChanged', this.state);
  }

  public verifySignature(event: SignableEvent): void {
    if (this.signature === undefined) {
      this.state = 'unauthorized';
      this.emit('signatureVerified', new SignatureError('Signature not set'));
      return;
    }

    const score = SignatureScoring.calculate(event.payload, this.signature);

    if (score === SignatureScoring.VALID) {
      this.state = 'valid';
    } else {
      this.state = 'invalid';
    }

    this.emit('signatureVerified', new SignatureError(null, this.state, score));
  }
}
