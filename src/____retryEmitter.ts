import { EventEmitter } from 'events';

class RetryEmitter extends EventEmitter {
  static instance: RetryEmitter;
  private constructor() {
    super();
  }

  static getInstance(): RetryEmitter {
    if (!RetryEmitter.instance) {
      RetryEmitter.instance = new RetryEmitter();
    }
    return RetryEmitter.instance;
  }

  /**
   * Emit a retry event with given data.
   * @param data - The data to emit with the event.
   */
  emitRetryEvent(data: { [key: string]: any }): void {
    this.emit('retry', data);
  }

  /**
   * Listen for retry events.
   * @param listener - The listener function to handle retry events.
   */
  onRetryEvent(listener: (data: { [key: string]: any }) => void): void {
    this.on('retry', listener);
  }
}

export default RetryEmitter.getInstance();
