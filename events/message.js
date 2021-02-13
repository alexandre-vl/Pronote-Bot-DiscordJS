module.exports = async(client, message) => {
    const Discord = require("discord.js")
    const pronote = require('pronote-api');
    const Enmap = require("enmap");
    const user = new Enmap({name: "user"}); 

    if (message.author.bot) return;

    user.ensure(message.author.id, {
        user: message.author.id,
        id: "none",
        mdp: "none",
        url: "https://0061642c.index-education.net/pronote/",
        cas: "atrium-sud"

    });
    await user.defer;

      // Ignorer les messages n'ayant pas le préfixe
    if (message.content.indexOf(client.config.prefix) !== 0) return;

    // Définir args et les commandes
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // chercher la commande
    const cmd = client.commands.get(command);

    // Si la commande n'existe pas, abandonner 
    if (!cmd) return;

    // Si elle existe, lancer la commande
    try {
        cmd.run(client, message, args);
    } catch (error) {
        console.log(error);
    }
}