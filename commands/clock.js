const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");
const date = require('date-and-time');

module.exports = {
    name: "clock",
    roles: [config.perms['mecano']],
    description: "Envoie l'horloge-météo",
    dmPermission: false,
    hidden: false,
    helpType: "moderation",

    runInteraction(client, interaction) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Météo - Horloge`)
            .setDescription(date.format(new Date(1662501600000), 'YYYY-MM-DD HH:mm:ss') + '\n☀️')
        client.channels.cache.get(config.channels['data']).send({ embeds: [embed] })
    }
}