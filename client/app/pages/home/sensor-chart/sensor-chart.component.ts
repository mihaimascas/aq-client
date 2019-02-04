import { Component, OnInit } from '@angular/core';
import { LogService } from "../../../services/log.service";
import { Log } from "../../../shared/models/log.model";
import * as moment from "moment";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-sensor-chart',
  templateUrl: './sensor-chart.component.html',
  styleUrls: ['./sensor-chart.component.scss']
})
export class SensorChartComponent implements OnInit {

  logs: Log[] = [];

  // Form
  interval: FormControl = new FormControl(1);
  selectedInterval = 1;
  settings: FormGroup;
  chartTypes: string[] = ['Lights & CO2', 'Temperature & Humidity'];
  chartType: FormControl = new FormControl(this.chartTypes[0]);

  // Chart
  public co2Data: number[] = [];
  public lightsData: number[] = [];
  public tempData: number[] = [];
  public humData: number[] = [];
  public labels: any[] = [];

  public lineChartData:Array<any>;
  public lineChartLabels:Array<any>;
  public lineChartOptions:any = {
    responsive: true,
    ticks: {
      min: 10,
      max: 48
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'minute'
        }
      }]
    }
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  constructor(
    private logService: LogService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getLogs();
    this.settings = this.fb.group({
      interval: this.interval,
      chartType: this.chartType
    });

    this.settings.valueChanges.subscribe(
      (val) => {
        if (val.interval === this.selectedInterval) {
          this.setChartData();
          return;
        }

        this.selectedInterval = val.interval;
        this.getLogs();
      }
    );

    this.interval.registerOnChange(this.getLogs);
    this.chartType.registerOnChange(this.setChartData)
  }

  getLogs() {
    const interval = this.interval.value;
    const date2 = moment().toDate();
    const date1 = moment().subtract(interval, 'day').toDate();
    this.logService.getLogs(date1, date2).subscribe(
      (logs) => {
        this.logs = logs;
        this.generateChartData();
      }
    );
  }

  generateChartData() {
    this.lineChartLabels = this.logs.map((log) => new Date(log.date));

    const labels = [];
    const co2Data = [];
    const lightsData = [];
    const tempData = [];
    const humData = [];

    this.logs.forEach((log) => {
      labels.push(new Date(log.date));
      co2Data.push(log.co2On ? 1 : 0);
      lightsData.push(log.lightOn ? 1 : 0);
      tempData.push(log.temperature);
      humData.push(log.humidity);
    });

    this.labels = labels;
    this.co2Data = co2Data;
    this.lightsData = lightsData;
    this.tempData = tempData;
    this.humData = humData;

    this.setChartData();
  }

  setChartData() {
    const type = this.chartType.value;
    console.log(type);

    switch (type) {
      case this.chartTypes[0]:
        this.lineChartData = [
          {data: this.co2Data, label: 'CO2 (on/off)'},
          {data: this.lightsData, label: 'Lights (on/off)'}
        ];
        break;
      case this.chartTypes[1]:
        this.lineChartData = [
          {data: this.tempData, label: 'Temp. (C)'},
          {data: this.humData, label: 'Hum. (%)'}
        ];
        break;
    }

    this.lineChartLabels = this.labels.slice(0);
  }
}
