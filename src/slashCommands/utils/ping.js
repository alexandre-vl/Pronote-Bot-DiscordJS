module.exports = {
  name: "ping",
  description: "Ping command",
  dir: "utils",
  /*  options: [
    {
      name: "ping",
      description: "Get the bot's latency",
      type: 3,
      required: false,
      choices: [
        { name: "yes", value: "true" },
        { name: "no", value: "false" },
      ],
    },
  ], // OPTIONAL, (/) command options ; read https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure */

  run: async (client, interaction) => {
    interaction.reply({
      content: `> Bot's latency : **${Math.round(client.ws.ping)}ms**`,
    });
  },
};
