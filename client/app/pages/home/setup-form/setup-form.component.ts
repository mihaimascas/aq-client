import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from "@angular/forms";
import {LogService} from "../../../services/log.service";
import {Log} from "../../../shared/models/log.model";
import * as moment from "moment";
import {ToastComponent} from "../../../shared/toast/toast.component";

@Component({
  selector: 'app-setup-form',
  templateUrl: './setup-form.component.html',
  styleUrls: ['./setup-form.component.scss']
})
export class SetupFormComponent implements OnInit {

  formLights1: FormGroup;
  formLights2: FormGroup;
  formCo2: FormGroup;
  controls: FormGroup;
  status: Log;

  constructor(
    private fb: FormBuilder,
    private logService: LogService,
    private toast: ToastComponent
  ) { }

  ngOnInit() {
    this.formLights1 = this.fb.group({
      lightTimeOn1: [null, Validators.required],
      lightTimeOff1: [null, Validators.required]
    });

    this.formLights2 = this.fb.group({
      lightTimeOn2: [null, Validators.required],
      lightTimeOff2: [null, Validators.required]
    });

    this.formCo2 = this.fb.group({
      co2TimeOn: [null, Validators.required],
      co2TimeOff: [null, Validators.required]
    });

    this.controls = this.fb.group({
      ledOn: false,
      co2On: false
    });

    this.controls.valueChanges.subscribe((val) => {
      this.logService.setControls(val).subscribe(() => this.onSuccess(), (err) => this.onError(err));
    });

    this.loadData();
  }

  loadData() {
    this.logService.getStatus().subscribe(
      (status: Log) => {
        this.status = status;

        this.formLights1.setValue({
          lightTimeOn1: status.lightTimeOn1,
          lightTimeOff1: status.lightTimeOff1
        });

        this.formLights2.setValue({
          lightTimeOn2: status.lightTimeOn2,
          lightTimeOff2: status.lightTimeOff2
        });

        this.formCo2.setValue({
          co2TimeOn: status.co2TimeOn,
          co2TimeOff: status.co2TimeOff
        });

        this.controls.setValue({
          ledOn: status.lightOn,
          co2On: status.co2On
        }, {emitEvent: false})
      },
      (err) => {
        this.toast.open('Loading data failed.', 'danger');
      }
    )
  }

  saveControls() {
    this.logService.setControls(this.controls.getRawValue()).subscribe(() => this.onSuccess(), (err) => this.onError(err));
  }

  saveSettingsLights1() {
    this.logService.setSettings(this.formLights1.getRawValue()).subscribe(() => this.onSuccess(), (err) => this.onError(err));
  }

  saveSettingsLights2() {
    this.logService.setSettings(this.formLights2.getRawValue()).subscribe(() => this.onSuccess(), (err) => this.onError(err));
  }

  saveSettingsCo2() {
    this.logService.setSettings(this.formCo2.getRawValue()).subscribe(() => this.onSuccess(), (err) => this.onError(err));
  }

  onSuccess() {
    this.toast.open('Done!', 'success');
    setTimeout(() => this.loadData(), 4000);
  }

  onError(err) {
    this.toast.open('Operation failed.', 'danger');
  }

  getLightOnTime() {
    if (!this.status) {
      return '-';
    }

    const anyDate = "2019-02-05";

    const led1On = moment(anyDate + ' ' + this.status.lightTimeOn1);
    const led1Off = moment(anyDate + ' ' + this.status.lightTimeOff1);
    const led2On = moment(anyDate + ' ' + this.status.lightTimeOn2);
    const led2Off = moment(anyDate + ' ' + this.status.lightTimeOff2);
    const diff1 = led1Off.diff(led1On, 'minutes');
    const diff2 = led2Off.diff(led2On, 'minutes');
    const sum = diff1 + diff2;
    const h = sum > 59 ? `${Math.floor(sum/60)}h` : '';

    return `${h} ${sum % 60}min / day`
  }

  getCo2OnTime() {
    if (!this.status) {
      return '-';
    }

    const anyDate = "2019-02-05";

    const co2On = moment(anyDate + ' ' + this.status.co2TimeOn);
    const co2Off = moment(anyDate + ' ' + this.status.co2TimeOff);
    const diff = co2Off.diff(co2On, 'minutes');
    const h = diff > 59 ? `${Math.floor(diff/60)}h` : '';

    return `${h} ${diff % 60}min / day`
  }
}
