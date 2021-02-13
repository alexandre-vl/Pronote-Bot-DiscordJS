module.exports = async(client) => {
    const Discord = require("discord.js")
    console.log("Ready")
    client.user.setActivity("Pronote (;help)", {
        type: "WATCHING"
    });
}