exports.run = (client, message ) => {
    const Discord = require("discord.js")
    const pronote = require('pronote-api');
    const Enmap = require("enmap");
    const user = new Enmap({name: "user"}); 
    const args = message.content.slice(client.config.prefix.length).split(/ +/);

    message.channel.send("Vos identifiants ont été supprimé de notre base de donnés")
    user.set(message.author.id, "none", "id")
    user.set(message.author.id, "none", "mdp") 
    user.set(message.author.id, "none", "url")
    user.set(message.author.id, "none", "cas")
}