interface IEventEmitter<T = any> {
  on(event: 'data', listener: (...args: [T, ...any[]]) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
}

export function promisifyEventEmitter(event: IEventEmitter): Promise<undefined>;
export function promisifyEventEmitter<T>(event: IEventEmitter, result: T): Promise<T>;
export function promisifyEventEmitter<T>(event: IEventEmitter, result?: T | undefined): Promise<T | undefined> {
  return new Promise<T | undefined>((resolve, reject) => {
    event.on('end', () => resolve(result));
    event.on('error', reject);
  })
}

export default function arrayifyStream<T = any>(stream: IEventEmitter<T>): Promise<T[]> {
  const array: T[] = [];
  return promisifyEventEmitter(stream.on('data', data => array.push(data)), array);
}
