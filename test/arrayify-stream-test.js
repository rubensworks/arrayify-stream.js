const arrayifyStream = require('..');
const Readable = require('stream').Readable;

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
    expect(await arrayifyStream(stream)).toEqual([ 'a' ]);
  });

  it('should handle a stream with three elements', async() => {
    const stream = new Readable({ objectMode: true });
    stream.push('a');
    stream.push('b');
    stream.push('c');
    stream.push(null);
    expect(await arrayifyStream(stream)).toEqual([ 'a', 'b', 'c' ]);
  });

  it('should handle a stream with one element', async() => {
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
    await expect(arrayifyStream(stream)).not.resolves;
  });

  it('should reject when the stream emits an error', async() => {
    const stream = new Readable({ objectMode: true });
    stream._read = () => {
      stream.emit('error', new Error('Stream error'));
    };
    await expect(arrayifyStream(stream)).rejects.toThrow(new Error('Stream error'));
  });
});
