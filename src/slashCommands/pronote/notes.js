const pronote = require("@dorian-eydoux/pronote-api");
const db = require("../../utils/db");

module.exports = {
  name: "notes",
  description: "Récupérer les notes Pronote",
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

    let session = await pronote
      .login(user.url, user.username, cryptr.decrypt(user.password), user.cas)
      .catch(async (err) => {
        return;
      });
    if (!session?.user)
      return await interaction.editReply({
        content:
          "`❌` Les informations de connexions sont invalides, veuillez vous relier avec les nouvelles informations.\n Exemple: ```/login Paul paul061234 ac-bordeaux https://demo.index-education.net/pronote/```\nPour voir la liste des CAS disponibles voir [ici](https://github.com/alexandre-vl/pronote-api/tree/master/src/cas).",
        ephemeral: true,
      });

    const marks = await session.marks();

    let notes = marks.subjects.map((subject) => {
      return {
        name: "• " + subject.name,
        value:
          "`👨‍🎓` Élève: " +
          subject.averages.student +
          " `💼` Classe: " +
          subject.averages.studentClass,
      };
    });

    await interaction.editReply({
      embeds: [
        {
          color: "#31946c",
          title: "Vos notes",
          description:
            marks.length == 0
              ? "Aucunes notes du trimestre"
              : "🎯 Moyenne générale: " +
                Math.round(
                  (marks.subjects.reduce(function (accu, current) {
                    return accu + current.averages.student;
                  }, 0) /
                    marks.subjects.length) *
                    10
                ) /
                  10 +
                "\n\n**🎈 Par matières :**",
          fields: notes,
          footer: {
            text: "Pronote Bot",
            icon_url: client.user.displayAvatarURL(),
          },
        },
      ],
    });
  },
};
