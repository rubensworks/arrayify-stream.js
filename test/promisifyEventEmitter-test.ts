import { promisifyEventEmitter } from '../index';
import { Readable } from 'stream';
import { fromArray } from 'asynciterator';

describe('promisifyEventEmitter', () => {
  it('should handle an empty stream', async () => {
    const stream = new Readable();
    stream.push(null);
    await expect(promisifyEventEmitter(stream.on('data', () => {}))).resolves.toBeUndefined();
  });

  it('should return the resolve value if supplied', async () => {
    const stream = new Readable();
    stream.push(null);
    await expect(promisifyEventEmitter(stream.on('data', () => {}), 1)).resolves.toEqual(1);
  });

  it('should handle a stream with data', async () => {
    const stream = new Readable();
    stream.push('a');
    stream.push('b');
    stream.push(null);
    await expect(promisifyEventEmitter(stream.on('data', () => {}))).resolves.toBeUndefined();
  });

  it('should work with more abstract event emitters', () => {
    return expect(promisifyEventEmitter(fromArray([]))).resolves.toBeUndefined();
  })
})
