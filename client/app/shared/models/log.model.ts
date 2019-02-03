export interface Log {
  _id?: any,
  timestamp?: number,
  lightOn?: boolean,
  lightTimeOn1?: string,
  lightTimeOff1?: string,
  lightTimeOn2?: string,
  lightTimeOff2?: string,
  co2On?: boolean,
  co2TimeOn?: string,
  co2TimeOff?: string,
  temperature?: number,
  humidity?: number,
  aquariumTemperature?: number,
  date?: Date,
}
