# node-red-edgepi-dac

## EdgePi DAC node

EdgePi DAC node that reads/writes voltage to a given output channel.

## Install
Install normally through the node-red editor or install with npm in your node-red directory
(typically located  at `~/node.red`) by running the following command:
```
npm install @edgepi-cloud/node-red-edgepi-digital-dac
```

### Properties
- **RPC Server**<br>
The connection to your EdgePi's RPC Server.
- **Channel**<br>
Select channel for analogue output read/write.
- **Method**<br>
Select method to either read or write.
- **Voltage to write** *number* <br>
When on write configuration: the amount of voltage between 0 and 10 to write to a selected channel.

### Inputs
Any message can be used to trigger this node.

### Outputs
- When configured to read voltage:
  - **payload** *number*: <br>
Voltage reading from selected channel.
  
- When configured to write voltage:
  - **payload** *string*<br>
A success message stating the voltage written to the selected channel.


**NOTE:** Currently, EdgePi nodes are only available on x86 systems.



