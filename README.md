# homebridge-FestoCpxControl
Control your Festo CPX through UDP packets.
The Plugin is not bound to especially the Festo CPX, you can also only send UDP Packets


# config.json

```
{
        "accessory": "FestoCpxControl",
        "name": "My Control",
        "host": "192.168.0.X",
        "port": 80,
        "on_payload": "HexValue",
        "off_payload": "HexValue",
}
```

## Configuration Params

|             Parameter            |                       Description                       | Required |
| -------------------------------- | ------------------------------------------------------- |:--------:|
| `name`                           | name of the accessory                                   |     ✓    |
| `host`                           | endpoint for whatever is receiving these requests       |     ✓    |
| `port`                           | port of destination                                     |     ✓    |
| `off_payload`                 | payload for the off state                            |     ✓    |
| `on_payload`                   | payload for the on state                              |     ✓    |
| `listen_Port`                   | port to listen on                              |     ✓    |

## Help

  - Make sure to specify a port and host in the config file.
  - If you only want to send UDP Data specify a different dummy listen_port for every Accessory to avoid errors
    - Or go back to version 1.0.0

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-FestoCpxControl`
3. Update your config file

## See also

* [homebridge-udp-lock](https://www.npmjs.com/package/homebridge-udp-lock)
* [homebridge-udp-json](https://www.npmjs.com/package/homebridge-udp-json)
