import * as mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  timestamp: { type: Number },
  lightOn: Boolean,
  lightAuto: Boolean,
  lightTimeOn1: String,
  lightTimeOff1: String,
  lightTimeOn2: String,
  lightTimeOff2: String,
  co2On: Boolean,
  co2Auto: Boolean,
  co2TimeOn: String,
  co2TimeOff: String,
  temperature: Number,
  humidity: Number,
  aquariumTemperature: Number,
  date: { type: Date, unique: true,  default: Date.now},
});

const Log = mongoose.model('Log', logSchema);

export default Log;
