var udp = require('./udp');

let Service;
let Characteristic;

// command queue
let todoList = [];
let timer    = null;
let timeout  = 200; // timeout between sending rc commands (in ms)

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

    // setup
    this.log = log;
    this.service = new Service.Switch(this.name);
    this.setupCpxSwitchService(this.service);

    // information service
    this.informationService = new Service.AccessoryInformation();
    this.informationService
      .setCharacteristic(Characteristic.Name, 'FestoCpxControl')
      .setCharacteristic(Characteristic.Manufacturer, 'mand')
      .setCharacteristic(Characteristic.Model, 'FestoCpxControl ' + this.name)
      .setCharacteristic(Characteristic.SerialNumber, '5-' + this.id);

  }

  getServices() {
    return [this.informationService, this.service];
  }

  setupCpxSwitchService(service) {
    let state = false;

    service
      .getCharacteristic(Characteristic.On)
      .on('set', (value, callback) => {
        state = value;
        let signal;
        let host_ip = this.host;
        let host_port = this.port;
        if(state) {
          signal = this.on_payload;
        } else {
          signal = this.off_payload;
        }
        todoList.push({
          'signal': signal,
          'host_ip': host_ip,
          'host_port': host_port,
          'callback': callback
        });
        if (timer === null) {
          timer = setTimeout(this.toggleNext, timeout, this);
        }
      });

    service
      .getCharacteristic(Characteristic.On)
      .on('get', (callback) => {
        callback(null, state);
      });
  }

  toggleNext(switchObject) {
    // get next todo item
    let todoItem = todoList.shift();
    let signal = todoItem['signal'];
    let host_ip = todoItem['host_ip'];
    let host_port = todoItem['host_port'];
    let callback = todoItem['callback'];
    // send signal
    localthis.udpRequest(host_ip, host_port, signal, function () {
        console.log("Switched ", signal);
    }.bind(this));
    // set timer for next todo
    if (todoList.length > 0) {
      timer = setTimeout(switchObject.toggleNext, timeout, switchObject);
    } else {
      timer = null;
    }
    // call callback
    callback();
  }

}


setupCpxSwitchService.prototype.udpRequest = function(host, port, payload, callback) {
  udp(host, port, payload, function (err) {
      callback(err);
  });
},

setupCpxSwitchService.prototype.getServices = function() {
return [this.service];
}