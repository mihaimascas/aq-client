import Log from '../models/log';
import {Subject, Observer, Observable} from 'rxjs';
import {Subscribable} from "rxjs/Observable";
import {el} from "@angular/platform-browser/testing/src/browser_util";

export default class LogCtrl {
  model = Log;

  constructor(serialObserver: Subject<any>) {
      serialObserver.subscribe(
        (data) => {
          if (data && data.type && data.type === 'LOG') {
            const d = data['data'];

            if (d) {
              this.insert({
                timestamp: d[0],
                lightOn: d[1] == 1,
                lightTimeOn1: this.toTime(d[2]),
                lightTimeOff1: this.toTime(d[3]),
                lightTimeOn2: this.toTime(d[4]),
                lightTimeOff2: this.toTime(d[5]),
                co2On: d[6] == 1,
                co2TimeOn: this.toTime(d[7]),
                co2TimeOff: this.toTime(d[8]),
                temperature: parseFloat(d[9]),
                humidity: parseFloat(d[10]),
                aquariumTemperature: parseFloat(d[9]),
              }).then((data) => {
                console.log('Log added to DB: ', data);
              }).catch((err: Error) => {
                console.log('Log not added to DB! Err: ', err.message);
              })
            }
          }
        }
      )
  }

  async insert(log) {
    const obj = new this.model(log);

    try {
      await obj.save();
      return obj;
    } catch(err) {
      throw new Error(err);
    }
  }

  private toTime(t: string): string {
    let tArr = t ? t.split(':') : [];

    if (tArr.length != 3) {
      return null;
    }

    tArr = tArr.map((el) => el.length == 2 ? el : '0' + el);

    return tArr.join(':');
  }
}
