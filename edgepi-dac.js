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

      // Init dac
      const dac = new rpc.DacService(transport)
  
      if (dac){
        console.info("DAC node initialized on:", transport);
        node.status({fill:"green", shape:"ring", text:"dac initialized"});
      }

      // Check correct configurations
      if(config.method === "write" && isNaN(voltage)){
        node.status({fill:"red", shape:"dot", text:"please enter a valid number to write voltage"});
      }
      else if(config.method === "write" && (voltage > 10 || voltage < 0)){
        node.status({fill:"red", shape:"dot", text:"please enter a voltage between 0 and 10"});
      }

    
      // init new dac instance
      
  
      // Input event listener
      node.on('input', async function(msg,send,done){
        node.status({fill:"green", shape:"dot", text:"input recieved"});
        try{
          // method call
          msg.payload = response;
        }
        catch(error){
          msg.payload = error;
          console.error(error)
        }
        
        send(msg)
        
        if (done) {
          done();
        }
      });
  
      node.on('close', (done) => {
        node.status({ fill: 'grey', shape: 'ring', text: 'dac node terminated' });
        done();
      });
    }
    
    RED.nodes.registerType('edgepi-dac-node', DacNode);
    
  };