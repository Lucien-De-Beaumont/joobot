const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");

module.exports = {
    name: "channelDelete",
    once: false,
    async execute(client, channel) {
        try { eval('config.guild_' + channel.guild.id + ".channels['plan-environs']"); eval('config.guild_' + channel.guild.id + ".zones.categories") } catch (err) { return Logger.debug('fatal error occured:' + err)}
        const embed = new Discord.MessageEmbed()
            .setTitle(`Plan des environs`)
            .setTimestamp()
            .setThumbnail(`${channel.guild.iconURL()}`)
            .setFooter({ text: 'Utilise ce plan pour connaître les différentes zones accessibles !', iconURL: `${client.user.displayAvatarURL()}` });
        let description = ""

        for (categoryID in eval('config.guild_' + channel.guild.id + ".zones.categories")) {
            description = description + '\n\n' + client.channels.cache.get(`${eval('config.guild_' + channel.guild.id + ".zones.categories['" + categoryID + "']")}`).name + '\n'
            client.channels.cache.get(`${eval('config.guild_' + channel.guild.id + ".zones.categories['" + categoryID + "']")}`).children.map(c => c).sort((a, b) => a.rawPosition - b.rawPosition).forEach(channel => {
                description = description + '\n<#' + channel.id + '>'
            })
        }

        embed.setDescription(description)
        client.channels.cache.get(eval("config.guild_" + channel.guild.id + ".channels['plan-environs']")).messages.fetch({ limit: 1 }).then(messages => {
            let lastMessage = messages.first();
            client.channels.cache.get(eval("config.guild_" + channel.guild.id + ".channels['plan-environs']")).messages.fetch(`${lastMessage.id}`).then(message => message.edit({ embeds: [embed] }))
        });

    },
};