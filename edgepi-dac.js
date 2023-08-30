const { checkValidWriteInput } = require('./helpers/nodeHelpers');

module.exports = function (RED) {
    const rpc = require('@edgepi-cloud/edgepi-rpc')
  
    function DacNode(config) {
      // Create new node instance with user config
      RED.nodes.createNode(this, config);
      const node = this;
      const ipc_transport = "ipc:///tmp/edgepi.pipe"
      const tcp_transport = `tcp://${config.tcpAddress}:${config.tcpPort}`
      const transport = (config.transport === "Network") ? tcp_transport : ipc_transport;
      const voltage = parseFloat(config.voltage);
      const channel = rpc.DACChannel[config.dacChannel];

      // Init dac
      const dac = null;
  
      if (dac){
        console.info("DAC node initialized on:", transport);
        node.status({fill:"green", shape:"ring", text:"dac initialized"});
      }
      else{
        node.status({fill:"red", shape:"ring", text:"dac failed to initialize."});
        throw new Error('Failed to initialize dac.')
      }

      // Enforce gain on write method and check valid configuration input
      let validWriteInput;
      if(config.method === "write"){
        dac.setDacGain(true,true);
        const upperLim = 10;
        const lowerLim = 0;
        validWriteInput = checkValidWriteInput(node, voltage, upperLim, lowerLim);
      }
  
      // Input event listener
      node.on('input', async function(msg,send,done){
        if(config.method === "write" && !validWriteInput){
          node.status({fill:"red", shape:"dot", text:"node made no call because it has invalid input."});
          return;
        }

        node.status({fill:"green", shape:"dot", text:"input recieved"});
        try{
          let response;
          if(config.method === "read"){
            const {voltageVal} = await dac.getState({
              analogOut: channel,
              voltage: true
            })
            response = voltageVal;
          }
          else if (config.method === "write"){
            response = await dac.writeVoltage(channel, voltage);
            
          }
          else {
            throw new Error(`Unexpected value: ${config.method}`);
          }
          msg.payload = response;
        }
        
        catch(error){
          msg.payload = error;
          console.error(error)
        }
        
        // Send msg
        send(msg)
        
        if (done) {
          done();
        }
      });
  }

    RED.nodes.registerType('edgepi-dac-node', DacNode);
    
  };