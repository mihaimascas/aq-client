import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Log } from '../shared/models/log.model';

@Injectable()
export class LogService {

  constructor(private http: HttpClient) { }

  getLogs(date1: Date, date2: Date): Observable<Log[]> {
    return this.http.get<Log[]>('/api/logs', {params: {dateStart: date1.getTime().toString(), dateEnd: date1.getTime().toString()}});
  }
}
