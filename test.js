const SerialPort = require('serialport');
const { StringDecoder } = require('string_decoder');

const Readline = SerialPort.parsers.Readline;

const port = new SerialPort('/dev/tty.usbmodem14101', {
  baudRate: 9600
});

const parser = port.pipe(new Readline({ delimiter: '\r\n' }))

const decoder = new StringDecoder('utf8');

parser.on('data', function (data) {
  console.log('Data:', decoder.write(data))
});

setInterval(() => {
  port.write('led1OnH\n11\n', function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
    console.log('message written')
  })
}, 3500);

