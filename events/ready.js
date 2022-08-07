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
        const guild = client.guilds.cache.get("1002135735241023548");
        console.log(client.slashCommands.map(cmd => cmd))
        // guild.commands.set(client.slashCommands.map(cmd => cmd));
    },
};
