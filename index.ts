interface IEventEmitter<T = any> {
  on(event: 'data', listener: (...args: [T, ...any[]]) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
}

export function promisifyEventEmitter(event: IEventEmitter): Promise<void> {
  return new Promise((resolve, reject) => {
    event.on('end', resolve);
    event.on('error', reject);
  })
}

export default async function arrayifyStream<T = any>(stream: IEventEmitter<T>): Promise<T[]> {
  const array: T[] = [];
  await promisifyEventEmitter(stream.on('data', data => { array.push(data) }));
  return array;
}
