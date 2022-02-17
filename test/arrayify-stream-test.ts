import { Readable } from 'stream';
import { fromArray } from 'asynciterator';
import arrayifyStream from '..';

describe('arrayify-stream', () => {
  it('should handle an empty stream', async() => {
    const stream = new Readable();
    stream.push(null);
    expect(await arrayifyStream(stream)).toEqual([]);
  });

  it('should handle a stream with one element', async() => {
    const stream = new Readable({ objectMode: true });
    stream.push('a');
    stream.push(null);
    expect(await arrayifyStream<string>(stream)).toEqual<string[]>([ 'a' ]);
  });

  it('should handle a stream with three elements', async() => {
    const stream = new Readable({ objectMode: true });
    stream.push('a');
    stream.push('b');
    stream.push('c');
    stream.push(null);
    expect(await arrayifyStream(stream)).toEqual([ 'a', 'b', 'c' ]);
  });

  it('should handle a stream with one element (no typing)', async() => {
    const stream = new Readable({ objectMode: true });
    stream.push('a');
    stream.push(null);
    expect(await arrayifyStream(stream)).toEqual([ 'a' ]);
  });

  it('should not resolve on an open stream', async() => {
    const stream = new Readable({ objectMode: true });
    stream._read = () => {
      // Do nothing
    };
    // @ts-expect-error
    await expect(arrayifyStream(stream)).not.resolves;
  });

  it('should reject when the stream emits an error during reading', async() => {
    const stream = new Readable({ objectMode: true });
    stream._read = () => {
      stream.emit('error', new Error('Stream error'));
    };
    await expect(arrayifyStream(stream)).rejects.toThrow(new Error('Stream error'));
  });

  it('should reject when the stream emits an error immediately after calling', async() => {
    const stream = new Readable({ objectMode: true });
    stream._read = () => {
      // Do nothing
    };
    const result = arrayifyStream(stream);
    stream.emit('error', new Error('Stream error'));
    await expect(result).rejects.toThrow(new Error('Stream error'));
  });

  it('should run on more exotic event emitters', async() => {
    await expect(arrayifyStream(fromArray([ 1, 2, 3 ]))).resolves.toEqual([ 1, 2, 3 ]);
    await expect(arrayifyStream<number>(fromArray([ 1, 2, 3 ]))).resolves.toEqual([ 1, 2, 3 ]);
  });
});
