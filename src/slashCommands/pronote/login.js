const pronote = require("@dorian-eydoux/pronote-api");
const db = require("../../utils/db");

module.exports = {
  name: "login",
  description: "Login to pronote",
  dir: "pronote",
  options: [
    {
      name: "username",
      description: "Your username",
      required: true,
      type: 3,
    },
    {
      name: "password",
      description: "Your password (securised)",
      required: true,
      type: 3,
    },
    {
      name: "cas",
      description: "Your establishment (ex: ac-bordeaux)",
      required: true,
      type: 3,
    },
    {
      name: "url",
      description:
        "Your pronote url (ex: https://demo.index-education.net/pronote/)",
      required: true,
      type: 3,
    },
  ],

  run: async (client, interaction, cryptr) => {
    await interaction.deferReply();
    let member = client.guilds.cache
      .get(interaction.guildId)
      .members.cache.get(interaction.user.id);

    let user = await db.select_one("global_data", "user", { _id: member.id });

    if (user)
      return await interaction.editReply({
        content:
          "`❌` Vous avez déjà lié votre compte. Si vous souhaitez le changer, utilisez la commande `/unlink`",
        ephemeral: true,
      });

    const username = interaction.options.getString("username");
    const password = interaction.options.getString("password");
    const cas = interaction.options.getString("cas");
    const url = interaction.options.getString("url");

    let session = await pronote
      .login(url, username, password, cas)
      .catch(async (err) => {
        return;
      });
    if (!session?.user)
      return await interaction.editReply({
        content:
          "`❌` Les informations de connexions sont invalides.\n Exemple: ```/login Paul paul061234 ac-bordeaux https://demo.index-education.net/pronote/```\nPour voir la liste des CAS disponibles voir [ici](https://github.com/alexandre-vl/pronote-api/tree/master/src/cas).",
        ephemeral: true,
      });

    let account = {
      _id: member.id,
      username: username,
      password: cryptr.encrypt(password),
      cas: cas,
      url: url,
    };

    await db.insert_obj("global_data", "user", account);

    await interaction.editReply({
      embeds: [
        {
          color: "#31946c",
          title: "Connexion réussie",
          description: `Vous êtes connecté en tant que **${session.user.name}**.\n\n\`Infos: votre mot de passe a bien été chiffrés.\``,
          footer: {
            text: "Pronote Bot",
            icon_url: client.user.displayAvatarURL(),
          },
        },
      ],
    });
  },
};
