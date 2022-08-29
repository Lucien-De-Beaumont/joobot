const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");
const date = require('date-and-time');

module.exports = {
    name: "clock",
    description: "Envoie l'horloge-météo",
    dmPermission: false,
    hidden: false,
    helpType: "moderation",

    runInteraction(client, interaction) {
        try { eval('config.guild_' + interaction.guild.id + ".perms['wholeStaff']"); eval('config.guild_' + interaction.guild.id + ".channels['meteo']") } catch (err) { return Logger.debug('fatal error occured:' + err) }

        if (!interaction.member.roles.cache.some(r => eval('config.guild_' + interaction.guild.id + ".perms['mecano']").includes(r.id))) { return interaction.reply({ content: `Vous n'avez pas les permissions nécessaires !`, ephemeral: true }) }

        const embed = new Discord.MessageEmbed()
            .setTitle(`Météo - Horloge`)
            .setDescription(date.format(new Date(1661983200000), 'YYYY-MM-DD HH:mm:ss') + '\n☀️')
        client.channels.cache.get(eval('config.guild_' + interaction.guild.id + '.channels[\'meteo\']')).send({ embeds: [embed] })
    }
}