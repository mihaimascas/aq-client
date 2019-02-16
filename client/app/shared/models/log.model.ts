import index from "@angular/cli/lib/cli";

export interface Log {
  _id?: any,
  timestamp?: number,
  lightOn?: boolean,
  lightAuto?: boolean,
  lightTimeOn1?: string,
  lightTimeOff1?: string,
  lightTimeOn2?: string,
  lightTimeOff2?: string,
  co2On?: boolean,
  co2Auto?: boolean,
  co2TimeOn?: string,
  co2TimeOff?: string,
  temperature?: number,
  humidity?: number,
  aquariumTemperature?: number,
  date?: Date,
}

export interface LogExtended extends Log {
  led1OnH?: number,
  led1OnM?: number,
  led1OffH?: number,
  led1OffM?: number,
  led2OnH?: number,
  led2OnM?: number,
  led2OffH?: number,
  led2OffM?: number,
  co2OnH?: number,
  co2OnM?: number,
  co2OffH?: number,
  co2OffM?: number,
  ledOn?: boolean
}
