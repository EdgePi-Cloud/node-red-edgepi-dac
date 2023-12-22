module.exports = function (RED) {
  const rpc = require("@edgepi-cloud/edgepi-rpc");

  function DacNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    let voltage = config.voltage;
    let gain = config.gain;
    let channel = config.channel;

    initializeNode(config).then((dac) => {
      node.on("input", async function (msg, send, done) {
        node.status({ fill: "green", shape: "dot", text: "input received" });
        try {
          gain = msg.gain ?? gain;
          voltage = msg.payload ?? voltage;
          channel = msg.channel ?? channel;

          if ((gain && voltage > 10) || voltage < 0 || (!gain && voltage > 5)) {
            throw new Error(
              "Voltage being written is outside the valid range."
            );
          }

          if (gain) {
            await dac.setDacGain(true, true);
          }
          msg = { payload: await dac.writeVoltage(channel - 1, voltage) };
        } catch (error) {
          msg = { payload: error };
          console.error(error);
        }
        send(msg);
        done?.();
      });
    });

    async function initializeNode(config) {
      const transport =
        config.transport === "Network"
          ? `tcp://${config.tcpAddress}:${config.tcpPort}`
          : "ipc:///tmp/edgepi.pipe";

      try {
        const dac = new rpc.DacService(transport);
        console.info("DAC node initialized on:", transport);
        node.status({ fill: "green", shape: "ring", text: "dac initialized" });

        if ((gain && voltage > 10) || voltage < 0 || (!gain && voltage > 5)) {
          throw new Error("Voltage being written is outside the valid range.");
        }
        if (gain) {
          await dac.setDacGain(true, true);
        }
        console.info(await dac.writeVoltage(channel - 1, voltage));
        return dac;
      } catch (error) {
        console.error(error);
        node.status({
          fill: "red",
          shape: "ring",
          text: "dac failed to initialize.",
        });
      }
    }
  }
  RED.nodes.registerType("dac", DacNode);
};
