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
            const d = data['body'];
            const temp = parseFloat(d[11]);
            const hum = parseFloat(d[12]);
            const aqTemp = parseFloat(d[13]);

            if (d) {
              this.insert({
                timestamp: d[0],
                lightOn: d[1] == 1 || d[1] == 'true',
                lightAuto: d[2] == 1 || d[2] == 'true',
                lightTimeOn1: this.toTime(d[3]),
                lightTimeOff1: this.toTime(d[4]),
                lightTimeOn2: this.toTime(d[5]),
                lightTimeOff2: this.toTime(d[6]),
                co2On: d[7] == 1 || d[7] == 'true',
                co2Auto: d[8] == 1 || d[8] == 'true',
                co2TimeOn: this.toTime(d[9]),
                co2TimeOff: this.toTime(d[10]),
                temperature: isNaN(temp) ? null : temp,
                humidity: isNaN(hum) ? null : hum,
                aquariumTemperature: isNaN(aqTemp) ? null : aqTemp,
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

  getLatest() {
    const req = this.model.findOne().sort({date: -1});

    return req.exec();
  }

  private toTime(t: string): string {
    let tArr = t ? t.split(':') : [];

    if (tArr.length != 2) {
      return null;
    }

    tArr = tArr.map((el) => el.length == 2 ? el : '0' + el);

    return tArr.join(':');
  }

  private splitTime(time: string): string[] {
    const splitTime = time.split(':');
    if (splitTime.length > 1) {
      return splitTime;
    }

    return null;
  }
}
