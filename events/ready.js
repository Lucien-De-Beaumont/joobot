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
        // guild.commands.set(client.slashCommands.map(cmd => cmd));

        /* let description
        client.channels.cache.get(`1003690286502920212`).children.map(c => c).sort((a, b) => a.rawPosition - b.rawPosition).forEach(channel => {
            description = description + '\n<#' + channel.id + '> | ' + channel.position
            console.log(channel.position)
        }) */

    },
};
