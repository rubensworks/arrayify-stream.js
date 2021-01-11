module.exports = function(stream) {
  return new Promise(function(resolve, reject) {
    const array = [];
    stream.on('data', function(data) {
      array.push(data);
    });
    stream.on('error', reject);
    stream.on('end', function() {
      resolve(array);
    });
  });
};
