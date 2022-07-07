const pronote = require("@dorian-eydoux/pronote-api");
const db = require("../../utils/db");

module.exports = {
  name: "unlink",
  description: "Unlink to pronote",
  dir: "pronote",
  options: [],

  run: async (client, interaction, cryptr) => {
    await interaction.deferReply();
    let member = client.guilds.cache
      .get(interaction.guildId)
      .members.cache.get(interaction.user.id);

    let user = await db.select_one("global_data", "user", { _id: member.id });

    if (!user)
      return await interaction.editReply({
        content:
          "`❌` Vous n'avez pas de compte lié. Si vous souhaitez le lié, utilisez la commande `/login`",
      });

    await db.delete_obj("global_data", "user", { _id: member.id });

    await interaction.editReply({
      embeds: [
        {
          color: "#31946c",
          title: "Compte délié",
          description: "Votre compte a bien été délié.",
          footer: {
            text: "Pronote Bot",
            icon_url: client.user.displayAvatarURL(),
          },
        },
      ],
    });
  },
};
