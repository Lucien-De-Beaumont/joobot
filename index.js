const { Client, Collection, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const config = require("./config");
const dotenv = require("dotenv");
dotenv.config();
const client = new Client({ intents: 3276799 });
const Logger = require("./utils/Logger");
const date = require('date-and-time');


["buttons", "selects", "slashCommands"].forEach(
  (x) => (client[x] = new Collection()),
);

["CommandUtil", "EventUtil", "ButtonUtil", "SelectUtil"].forEach((handler) => {
  require(`./utils/handlers/${handler}`)(client);
});

process.on("exit", (code) => {
  if (code == 0) return Logger.client(`Le processus a été arrêté manuellement`);
  Logger.client(`Le processus s'est arrêté avec le code ${code}`);
});
process.on("uncaughtException", (err, origin) => {
  Logger.error(`UNCAUGHT_EXCEPTION: ${err}`);
  console.log(origin);
});
process.on("unhandledRejection", (reason, promise) => {
  Logger.warn(`UNHANDLED_REJECTION: ${reason}`);
  console.log(promise);
});
process.on("warning", (...args) => Logger.warn(...args));

client.login(process.env.DISCORD_TOKEN);
