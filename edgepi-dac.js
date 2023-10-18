module.exports = function (RED) {
  const rpc = require("@edgepi-cloud/edgepi-rpc");

  function DacNode(config) {
    // Create new node instance with user config
    RED.nodes.createNode(this, config);
    const node = this;
    const ipc_transport = "ipc:///tmp/edgepi.pipe";
    const tcp_transport = `tcp://${config.tcpAddress}:${config.tcpPort}`;
    const transport =
      config.transport === "Network" ? tcp_transport : ipc_transport;
    const voltage = parseFloat(config.voltage);
    const channel = rpc.DACChannel[config.dacChannel];

    const dac = new rpc.DacService(transport);

    //  TODO: potentially update if condition based on pos values of dac
    if (dac) {
      console.log(config.gainOption);
      console.log(config.voltage);
      console.log(config.transport);
      console.log(config.tcpPort);
      console.info("DAC node initialized on:", transport);
      node.status({ fill: "green", shape: "ring", text: "dac initialized" });
    } else {
      node.status({
        fill: "red",
        shape: "ring",
        text: "dac failed to initialize.",
      });
      throw new Error("Failed to initialize dac.");
    }

    node.on("input", async function (msg, send, done) {
      node.status({ fill: "green", shape: "dot", text: "input received" });
      try {
        if (config.gain2) {
          console.log("before set gain");
          await dac.setDacGain(true, true);
          console.log("after set gain");
        }
        console.log("before response");
        const response = await dac.writeVoltage(channel, voltage);
        console.log("after response");
        msg.payload = response;
      } catch (error) {
        msg.payload = error;
        console.error(error);
        if (done) {
          done(error);
        }
      }
      console.log("before send message");
      send(msg);
      console.log("after send message");
      if (done) {
        done();
      }
    });
  }
  RED.nodes.registerType("dac", DacNode);
};
