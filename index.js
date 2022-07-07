const { Client, Collection, Intents } = require("discord.js");
const client = new Client({
  allowedMentions: { parse: ["users", "roles"] },
  fetchAllMembers: false,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const dotenv = require("dotenv");
dotenv.config();

const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.CRYPT_KEY);

//SET COLLECTION
client.commandes = new Collection();
client.slash = new Collection();
client.aliases = new Collection();
cooldowns = new Collection();

//SET UTILS
client.logger = require("./src/utils/logger");
client.color = require("./src/utils/color.js");

//SET CONFIG
client.config = {
  token: process.env.TOKEN,
  prefix: process.env.PREFIX,
  owner: process.env.OWNER,
  guildID: process.env.GUILDID,
  botID: process.env.BOTID,
};

["error", "slashCommands", "event"].forEach((file) => {
  require(`./src/utils/handlers/${file}`)(client);
});

client.login(client.config.token);

require("./slash");

module.exports.cryptr = cryptr;
