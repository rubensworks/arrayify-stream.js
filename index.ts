import type { EventEmitter } from 'events'

function promisifyEventEmitter<T>(event: EventEmitter, result: T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    event.on('end', () => resolve(result));
    event.on('error', reject);
  })
}

export default function arrayifyStream<T = any>(stream: EventEmitter): Promise<T[]> {
  const array: T[] = [];
  return promisifyEventEmitter(stream.on('data', data => array.push(data)), array);
}
