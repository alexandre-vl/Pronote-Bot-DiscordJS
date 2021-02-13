const Discord = require("discord.js")
const pronote = require('pronote-api');
const Enmap = require("enmap");
const fs = require("fs");
const user = new Enmap({name: "user"}); 
const prefix = ";"
const moment = require("moment");
moment.locale("fr");
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const config = require("./config.json")
client.config = config

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
    });
})
  
  client.commands = new Enmap();
  
  fs.readdir("./commandes/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commandes/${file}`);
      let commandName = file.split(".")[0];
      console.log(`Attempting to load command ${commandName}`);
      client.commands.set(commandName, props);
    });
  });

client.login(config.token)