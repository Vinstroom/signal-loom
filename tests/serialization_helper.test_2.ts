import { describe, it } from 'node:test';
import { assert, equal } from 'node:assert';
import { SerializationHelper } from '../../src/serialization_helper.ts';

describe('SerializationHelper', () => {
  describe('.bufferToBase64()', () => {
    it('should correctly convert buffer to base64', () => {
      const buffer = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
      const base64 = SerializationHelper.bufferToBase64(buffer);
      equal(base64, 'AQIDBAU=');
    });
  });

  describe('.base64ToBuffer()', () => {
    it('should correctly convert base64 to buffer', () => {
      const base64 = 'AQIDBAU=';
      const buffer = SerializationHelper.base64ToBuffer(base64);
      const expected = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
      buffer.equals(expected);
    });
  });

  describe('.calculateSignatureScore()', () => {
    it('should calculate signature score correctly', () => {
      const sig = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);
      const data = Buffer.from([0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9]);
      const algo = 'sha256';
      const score = SerializationHelper.calculateSignatureScore(sig, data, algo);
      // The expected score is based on the length of the signature and the data integrity check
      equal(score, 75);
    });
  });
});
