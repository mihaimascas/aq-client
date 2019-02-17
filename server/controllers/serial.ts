import { Subject, Observable, Observer } from 'rxjs';
import { StringDecoder } from 'string_decoder';

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const SERIAL_PORT = '/dev/ttyACM0';


export default class SerialCtrl {

  port;
  parser;
  serialOpen = false;

  decoder = new StringDecoder('utf8');
  subject: Subject<any> = new Subject();

  paramList = ['led1OnH', 'led1OnM', 'led1OffH', 'led1OffM', 'led2OnH', 'led2OnM', 'led2OffH', 'led2OffM',
    'co2OnH', 'co2OnM', 'co2OffH', 'co2OffM', 'ledOn', 'ledAuto', 'co2On', 'co2Auto'];

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

  private reconnectSerial() {
    this.port = null;
    setTimeout(() => {
      this.connectSerial();
    }, 10000)
  }

  getUpdates(): Subject<any> {
    return this.subject;
  }

  private parseData(data) {
    console.log("Serial data: ", data);
    const rawData = this.decoder.write(data);
    const dataArr = rawData ? rawData.split('||') : [];

    if (dataArr.length > 1) {
      return {
        type: dataArr[0],
        body: dataArr.slice(1)
      }
    }

    return null;
  }

  public write(options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const params = this.generateParams(options);
      console.log(params);

      if (params && this.port) {
        this.port.write(params, (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      } else {
        reject(new Error('Port or parameters missing.'));
      }
    })
  }

  private generateParams(options): string {
    if (!options) {
      return null;
    }

    const params = [];

    this.paramList.forEach((param) => {
      if (typeof options[param] !== 'undefined') {
        params.push(`$${param}=${options[param]}`);
      }
    });

    return params.join('&') + '\n';
  }
}
