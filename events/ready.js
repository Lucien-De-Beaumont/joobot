const Logger = require("../utils/Logger");
const Discord = require('discord.js');
const config = require('../config');
const cron = require('cron');
const date = require('date-and-time');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        Logger.client('Je suis ON!')
        // console.log(client.slashCommands.map(cmd => cmd))
        // client.application.commands.set([]);
        client.application.commands.set(client.slashCommands.map(cmd => cmd));
        // const guild = client.guilds.cache.get("1002135735241023548");
        // guild.commands.set([]);
    },
};
