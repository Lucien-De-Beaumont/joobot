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
        const guild = client.guilds.cache.get("831199788728844348");
        guild.commands.set(client.slashCommands.map(cmd => cmd));

        // client.channels.cache.get('982334787492646974').send(`<@678930787478929444> est-ce que tu veux je créé une commande genre \`/say <channel> <texte>\` pour que tu puisses faire dire ce que tu veux au bot ?`)
        // client.channels.cache.get('831199788728844351').messages.fetch('1004078671168012388').then(message => message.reply('Haha merci ^^'))
    },
};
