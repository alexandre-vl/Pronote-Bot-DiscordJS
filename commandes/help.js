exports.run = (client, message ) => {
    const Discord = require("discord.js")
    const help = new Discord.MessageEmbed()
            .setAuthor("Menu aide")
            .setDescription("`;login` -> permet de vous enregistrer dans notre base de donnés.\n`;logout` -> permet de supprimer vos donnés de notre base.\n`;infos` -> permet d'obtenir quelques informations sur votre session.\n\nNous précisons tout de meme que les identifiants ne sont pas visibles par les créateurs du bot.")
    message.channel.send(help)
}