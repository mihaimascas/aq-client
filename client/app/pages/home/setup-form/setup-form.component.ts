import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from "@angular/forms";
import {LogService} from "../../../services/log.service";
import {Log} from "../../../shared/models/log.model";

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
    private logService: LogService
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
      this.logService.setControls(val).subscribe(() => {
        setTimeout(() => this.loadData(), 3000);
      });
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
      }
    )
  }

  saveControls() {
    this.logService.setControls(this.controls.getRawValue()).subscribe(() => {
      setTimeout(() => this.loadData(), 3000);
    });
  }

  saveSettingsLights1() {
    this.logService.setSettings(this.formLights1.getRawValue()).subscribe(() => {
      setTimeout(() => this.loadData(), 3000);
    });
  }

  saveSettingsLights2() {
    this.logService.setSettings(this.formLights2.getRawValue()).subscribe(() => {
      setTimeout(() => this.loadData(), 3000);
    });
  }

  saveSettingsCo2() {
    this.logService.setSettings(this.formCo2.getRawValue()).subscribe(() => {
      setTimeout(() => this.loadData(), 3000);
    });
  }

}
