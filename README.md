# homebridge-FestoCpxControl
Control your Festo CPX through UDP packets


# config.json

```
{
        "accessory": "FestoCpxControl",
        "name": "My Lock",
        "host": "192.168.0.X",
        "port": 80,
        "on_payload": "874652395hjui4d98523",
        "off_payload": "8932y4123545j5k245325",
}
```

## Configuration Params

|             Parameter            |                       Description                       | Required |
| -------------------------------- | ------------------------------------------------------- |:--------:|
| `name`                           | name of the accessory                                   |     ✓    |
| `host`                           | endpoint for whatever is receiving these requests       |     ✓    |
| `port`                           | port of destination                                     |     ✓    |
| `off_payload`                 | payload for the unlock state                            |     ✓    |
| `on_payload`                   | payload for the lock state                              |     ✓    |
| `defaultState`                   | default state when restarting (lock/unlock)             |     ✓    |

## Help

  - Make sure to specify a port and host in the config file.

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-FestoCpxControl`
3. Update your config file
