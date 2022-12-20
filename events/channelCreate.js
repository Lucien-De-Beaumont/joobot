const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");

module.exports = {
    name: "channelCreate",
    once: false,
    async execute(client, channel) {
        if(typeof config.zones.plans[channel.parentId] == 'undefined'){ return }
        const embed = new Discord.MessageEmbed()
            .setTitle(`Plan des environs`)
            .setTimestamp()
            .setThumbnail(`${channel.guild.iconURL()}`)
            .setFooter({ text: 'Utilise ce plan pour connaître les différentes zones accessibles !', iconURL: `${client.user.displayAvatarURL()}` });
        let description = ""

        description = description + '\n\n' + client.channels.cache.get(channel.parentId).name + '\n'
        client.channels.cache.get(channel.parentId).children.map(c => c).sort((a, b) => a.rawPosition - b.rawPosition).forEach(channel => {
            description = description + '\n<#' + channel.id + '>'
        })

        embed.setDescription(description)
        client.channels.cache.get(config.zones.plans[channel.parentId]).messages.fetch({ limit: 1 }).then(messages => {
            let lastMessage = messages.first();
            client.channels.cache.get(config.zones.plans[channel.parentId]).messages.fetch(`${lastMessage.id}`).then(message => message.edit({ embeds: [embed] }))
        });
    },
};