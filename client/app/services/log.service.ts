import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import {Log, LogExtended} from '../shared/models/log.model';
import * as moment from "moment";
import {User} from "../shared/models/user.model";

@Injectable()
export class LogService {

  constructor(private http: HttpClient) { }

  getLogs(date1: Date, date2: Date): Observable<Log[]> {
    return this.http.get<Log[]>('/api/logs',
      {
        params: {
          dateStart: moment(date1).unix().toString(),
          dateEnd: moment(date2).unix().toString()
        }
      });
  }

  getStatus(): Observable<Log> {
    return this.http.get<Log>('/api/status');
  }

  setSettings(settings: Log): Observable<any> {
    return this.http.post('/api/status', this.toExtendedLog(settings), {responseType: 'text'});
  }

  setControls(controls: LogExtended): Observable<any> {
    return this.http.post('/api/status', controls, {responseType: 'text'});
  }

  private toExtendedLog(log: Log): LogExtended {
    if (log.lightTimeOn1 && log.lightTimeOff1) {
      const led1On = this.getTimeArray(log.lightTimeOn1);
      const led1Off = this.getTimeArray(log.lightTimeOff1);

      return {
        led1OnH: led1On[0],
        led1OnM: led1On[1],
        led1OffH: led1Off[0],
        led1OffM: led1Off[1]
      }
    }

    if (log.lightTimeOn2 && log.lightTimeOff2) {
      const led2On = this.getTimeArray(log.lightTimeOn2);
      const led2Off = this.getTimeArray(log.lightTimeOff2);

      return {
        led2OnH: led2On[0],
        led2OnM: led2On[1],
        led2OffH: led2Off[0],
        led2OffM: led2Off[1]
      }
    }

    if (log.co2TimeOn && log.co2TimeOff) {
      const co2On = this.getTimeArray(log.co2TimeOn);
      const co2Off = this.getTimeArray(log.co2TimeOff);

      return {
        co2OnH: co2On[0],
        co2OnM: co2On[1],
        co2OffH: co2Off[0],
        co2OffM: co2Off[1]
      }
    }
  }

  private getTimeArray(time: string): number[] {
    const arr = time.split(':');

    if (arr.length != 2) {
      return null;
    }

    return arr.map((i) => parseInt(i));
  }
}
