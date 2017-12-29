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

    //UDP Server Code

    this.server = dgram.createSocket('udp4');


    this.server.on('error', (err) => {
      console.log(`udp server error:\n${err.stack}`);
      this.server.close();
    });


    this.server.on('message', (msg, rinfo) => {
      console.log(`server received udp: ${msg} from ${rinfo.address}`);
      var buf = Buffer.from('0100', 'hex');
      console.log(buf.toString('hex'));
      if(msg == buf.toString('hex')) {
          console.log(`passt`);
      } else {
        console.log(`passt nicht`);
        buf = msg;
        console.log(buf.toString('hex'));
      };
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
