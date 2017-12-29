var udp = require('./udp');
const dgram = require('dgram');

let Service;
let Characteristic;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-FestoCpxControl', 'FestoCpxControl', FestoCpxControl);
};

class FestoCpxControl {
  constructor(log, config) {


    // config
    this.name = config["name"];
    this.host = config["host"];
    this.port = config["port"];
    this.on_payload = config["on_payload"];
    this.off_payload = config["off_payload"];
    this.listen_port = config["listen_port"] || 8268;
    this.currentState = false;

    // setup
    this.log = log;

    this.service = new Service.Switch(this.name);
    //this.setupCpxSwitchService(this.service);

    this.service
      .getCharacteristic(Characteristic.On)
      .on('get', this.getState.bind(this))
      .on('set', this.setState.bind(this));


    // information service
    this.informationService = new Service.AccessoryInformation();
    this.informationService
      .setCharacteristic(Characteristic.Name, 'FestoCpxControl')
      .setCharacteristic(Characteristic.Manufacturer, 'mand')
      .setCharacteristic(Characteristic.Model, 'FestoCpxControl ' + this.name)
      .setCharacteristic(Characteristic.SerialNumber, '5');;
/*
    //UDP Server Code

    this.server = dgram.createSocket('udp4');


    this.server.on('error', (err) => {
      console.log(`udp server error:\n${err.stack}`);
      this.server.close();
    });


    this.server.on('message', (msg, rinfo) => {
      console.log(`server received udp: ${msg} from ${rinfo.address}`);
    });

    this.server.bind(this.listen_port);
*/

/*
this.informationService = new Service.AccessoryInformation();

this.informationService
  .setCharacteristic(Characteristic.Manufacturer, "Bosch")
  .setCharacteristic(Characteristic.Model, "RPI-UDPJSON")
  .setCharacteristic(Characteristic.SerialNumber, this.device);

this.temperatureService = new Service.TemperatureSensor(this.name_temperature);

this.temperatureService
  .getCharacteristic(Characteristic.CurrentTemperature)
  .setProps({
    minValue: -100,
    maxValue: 100
  });

this.humidityService = new Service.HumiditySensor(this.name_humidity);
*/

this.server = dgram.createSocket('udp4');

this.server.on('error', (err) => {
  console.log(`udp server error:\n${err.stack}`);
  this.server.close();
});

this.server.on('message', (msg, rinfo) => {
  console.log(`server received udp: ${msg} from ${rinfo.address}`);

  let json;
  try {
      json = JSON.parse(msg);
  } catch (e) {
      console.log(`failed to decode JSON: ${e}`);
      return;
  }

  const temperature_c = json.temperature_c;
  //const pressure_hPa = json.pressure_hPa; // TODO
  //const altitude_m = json.altitude_m;
  const humidity_percent = json.humidity_percent;

  this.temperatureService
    .getCharacteristic(Characteristic.CurrentTemperature)
    .setValue(temperature_c);

  this.humidityService
    .getCharacteristic(Characteristic.CurrentRelativeHumidity)
    .setValue(humidity_percent);
});

this.server.bind(this.listen_port);

  }

  getServices() {
    return [this.informationService, this.service];
  }


  setState(state, callback) {
    var on_state = this.currentState;

    let signal;
    let host_ip = this.host;
    let host_port = this.port;
    if(on_state) {
      signal = this.off_payload;
      this.currentState = false;

      udpRequest(this.host, this.port, this.off_payload, function () {
          console.log("Payload send: ", this.off_payload);
      }.bind(this));

    } else {
      signal = this.on_payload;
      this.currentState = true;

      udpRequest(this.host, this.port, this.on_payload, function () {
          console.log("Payload send: ", this.on_payload);
      }.bind(this));

    }

    callback();
  }

  getState(callback) {
    callback(null, this.currentState);
  }

}


udpRequest = function(host, port, payload, callback) {
  udp(host, port, payload, function (err) {
      callback(err);
  });
},
getServices = function() {
return [this.service];
}
