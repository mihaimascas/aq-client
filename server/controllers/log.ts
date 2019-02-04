import Log from '../models/log';
import {Subject, Observer, Observable} from 'rxjs';
import {Subscribable} from "rxjs/Observable";
import {el} from "@angular/platform-browser/testing/src/browser_util";
import * as moment from "moment";

export default class LogCtrl {
  model = Log;

  constructor(serialObserver: Subject<any>) {
      serialObserver.subscribe(
        (data) => {
          if (data && data.type && data.type === 'LOG') {
            const d = data['data'];
            const temp = parseFloat(d[9]);
            const hum = parseFloat(d[10]);

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
                temperature: isNaN(temp) ? null : temp,
                humidity: isNaN(hum) ? null : hum,
                aquariumTemperature: isNaN(temp) ? null : temp,
              }).then((data) => {
                console.log('Log added to DB');
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

  getInRange(min: number, max: number): Promise<any> {
    const date1 = moment.unix(min).toDate();
    const date2 = moment.unix(max).toDate();

    const req = this.model.find({}).where('date').gte(date1).lte(date2);

    return req.exec();
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
