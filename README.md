# node-red-edgepi-dac

## EdgePi DAC node

EdgePi DAC node that reads/writes voltage to a given output channel.

## Install

Install normally through the node-red editor or install with npm in your node-red directory
(typically located at `~/node.red`) by running the following command:

```
npm install @edgepi-cloud/node-red-edgepi-digital-dac
```

### Properties

- **RPC Server**<br>
  The connection to your EdgePi's RPC Server.
- **Channel**<br>
  The channel for analogue output read/write.
- **Gain**<br>
  Enable/ disable internal DAC gain. Gain enabled allows for a larger output voltage for a given input voltage but reduces accuracy.
- **Output voltage** _number_ <br>
  The amount of voltage to write to a selected channel. Range is 0-5 for gain off and 0-10 for gain on.

### Inputs

- **payload** _number_: <br>
  The voltage to write.
- **gain** _boolean_: <br>
  'false' for gain disabled (off), 'true' for gain enabled (on).
- **channel** _number_: <br>

Example input:

```
msg {
  "payload": 2.5,
  "gain": false,
  "channel": 7
}
```

### Outputs

- **payload** _number_<br>
  Voltage written to the selected channel.
