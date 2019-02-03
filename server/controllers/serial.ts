import { Subject, Observable, Observer } from 'rxjs';
import { StringDecoder } from 'string_decoder';

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const SERIAL_PORT = '/dev/tty.usbmodem14101';

export default class SerialCtrl {

  port;
  parser;
  serialOpen = false;

  decoder = new StringDecoder('utf8');
  subject: Subject<any> = new Subject();

  constructor() {
    this.connectSerial();
  }

  connectSerial() {
    this.serialOpen = false;

    this.port = new SerialPort(SERIAL_PORT, {
      baudRate: 9600,
      autoOpen: false,
      parser: new Readline({ delimiter: '\r\n' })
    });

    this.parser = this.port.pipe(new Readline({ delimiter: '\r\n' }));

    this.parser.on('data', (data) => {
      let d = this.parseData(data);
      if (d) {
        this.subject.next(d);
      }
    });

    this.port.on('close', (data) => {
      console.log('Close port');
      this.reconnectSerial();
    });

    this.port.on('error', (err) => {
      console.log('Error port: ', err);
      this.reconnectSerial();
    });

    this.port.on('open', () => {
      this.subject.next({
        type: 'CONNECTED',
        data: []
      });
    });

    this.port.open((err) => {
      if (err) {
        this.serialOpen = true;
        console.log('Error opening port: ', err.message);
        this.reconnectSerial();
      }

      this.serialOpen = true;
    })
  }

  reconnectSerial() {
    this.port = null;
    setTimeout(() => {
      this.connectSerial();
    }, 10000)
  }

  getUpdates(): Subject<any> {
    return this.subject;
  }

  parseData(data) {
    const rawData = this.decoder.write(data);
    const dataArr = rawData ? rawData.split('||') : [];

    if (dataArr.length > 1) {
      return {
        type: dataArr[0],
        data: dataArr.slice(1)
      }
    }

    return null;
  }
}
