import {Component, OnInit, ViewChild} from '@angular/core';
import { LogService } from "../../../services/log.service";
import { Log } from "../../../shared/models/log.model";
import * as moment from "moment";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {BaseChartDirective} from "ng2-charts";

@Component({
  selector: 'app-sensor-chart',
  templateUrl: './sensor-chart.component.html',
  styleUrls: ['./sensor-chart.component.scss']
})
export class SensorChartComponent implements OnInit {

  logs: Log[] = [];

  // Form
  selectedInterval = 1;
  interval: FormControl = new FormControl(this.selectedInterval);
  settings: FormGroup;

  public chartData1:Array<any>;
  public chartData2:Array<any>;
  public chartData3:Array<any>;

  public chartOptions1:any = {
    responsive: true,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'hour',
          minUnit: 'minute'
        }
      }],
      yAxes: [{
        display: true,
        ticks: {
          suggestedMin: 0,
          suggestedMax: 40,
        }
      }]
    }
  };
  public chartOptions2:any = {
    responsive: true,
    elements: {
      line: {
        tension: 0,
      }
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'hour',
          minUnit: 'minute'
        }
      }],
      yAxes: [{
        display: true,
        ticks: {
          suggestedMin: -0.5,
          suggestedMax: 2,
        }
      }]
    }
  };
  public chartOptions3:any = {
    responsive: true,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'hour',
          minUnit: 'minute'
        }
      }],
      yAxes: [{
        display: true,
        ticks: {
          suggestedMin: 0,
          suggestedMax: 60,
        }
      }]
    }
  };

  public chartColors1:Array<any> = [
    { // blue
      backgroundColor: 'rgba(41,182,246,0.2)',
      borderColor: 'rgba(41,182,246,1)',
      pointBackgroundColor: 'rgba(41,182,246,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(41,182,246,0.8)'
    },
    { // green
      backgroundColor: 'rgba(139, 195, 74 ,0.2)',
      borderColor: 'rgba(139, 195, 74 ,1)',
      pointBackgroundColor: 'rgba(139, 195, 74 ,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(139, 195, 74 ,1)'
    }
  ];

  public chartColors2:Array<any> = [
    { // blue
      backgroundColor: 'rgba(41,182,246,0.2)',
      borderColor: 'rgba(41,182,246,1)',
      pointBackgroundColor: 'rgba(41,182,246,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(41,182,246,0.8)'
    },
    { // green
      backgroundColor: 'rgba(139, 195, 74 ,0.2)',
      borderColor: 'rgba(139, 195, 74 ,1)',
      pointBackgroundColor: 'rgba(139, 195, 74 ,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(139, 195, 74 ,1)'
    }
  ];

  public chartColors3:Array<any> = [
    { // blue
      backgroundColor: 'rgba(41,182,246,.1)',
      borderColor: 'rgba(41,182,246,1)',
      pointBackgroundColor: 'rgba(41,182,246,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(41,182,246,0.8)'
    },
    { // green
      backgroundColor: 'rgba(139, 195, 74 ,0)',
      borderColor: 'rgba(139, 195, 74 ,1)',
      pointBackgroundColor: 'rgba(139, 195, 74 ,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(139, 195, 74 ,0.8)'
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
    });

    this.settings.valueChanges.subscribe(() => {
      this.getLogs();
    });
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
    const co2Data = [];
    const lightsData = [];
    const tempData = [];
    const aqTempData = [];
    const humData = [];

    this.logs.forEach((log) => {
      let date = new Date(log.date);

      co2Data.push({x: date, y: log.co2On ? 1.5 : 0});
      lightsData.push({x: date, y: log.lightOn ? 1 : 0});

      if (log.temperature !== null) {
        tempData.push({x: date, y: log.temperature});
      }

      if (log.humidity !== null) {
        humData.push({x: date, y: log.humidity});
      }

      if (log.aquariumTemperature !== null) {
        aqTempData.push({x: date, y: log.aquariumTemperature})
      }
    });

    this.chartData1 = [
      {data: aqTempData, label: 'Aq. Temp. (C)'}
    ];

    this.chartData2 = [
      {data: lightsData, label: 'Lights (on/off)'},
      {data: co2Data, label: 'CO2 (on/off)'}
    ];

    this.chartData3 = [
      {data: tempData, label: 'Temp. (C)'},
      {data: humData, label: 'Humidity (%)'}
    ];
  }
}
