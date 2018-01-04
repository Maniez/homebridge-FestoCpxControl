module.exports = function (host, port, payload, callback) {
  var message = new Buffer(payload, 'hex');
  var dgram = require('dgram');
  var client = dgram.createSocket('udp4');

  setTimeout(() => {
      client.send(message, 0, message.length, port, host, (err, bytes) => {
        if (err) throw err;
        client.close();
        callback(err);
      });
  }, 50);
}
