import type { EventEmitter } from 'node:events';

function promisifyEventEmitter<T>(event: EventEmitter, result: T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    event.on('end', () => resolve(result));
    event.on('error', reject);
  });
}

export function arrayifyStream<T = any>(stream: EventEmitter): Promise<T[]> {
  const array: T[] = [];
  return promisifyEventEmitter(stream.on('data', (data: T) => array.push(data)), array);
}
