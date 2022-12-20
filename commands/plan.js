const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");

module.exports = {
    name: "plan",
    roles: [config.perms['mecano']],
    description: "Envoie le plan des salons",
    dmPermission: false,
    hidden: false,
    helpType: "moderation",

    runInteraction(client, interaction) {        
        const embed = new Discord.MessageEmbed()
            .setTitle(`Plan des environs`)
            .setTimestamp()
            .setThumbnail(`${interaction.guild.iconURL()}`)
            .setFooter({ text: 'Utilise ce plan pour connaître les différentes zones accessibles !', iconURL: `${client.user.displayAvatarURL()}` });
        let description = ""

            description = description + '\n\n' + client.channels.cache.get(interaction.channel.parentId).name + '\n'
            client.channels.cache.get(interaction.channel.parentId).children.map(c => c).sort((a, b) => a.rawPosition - b.rawPosition).forEach(channel => {
                description = description + '\n<#' + channel.id + '>'
            })

            embed.setDescription(description)
            client.channels.cache.get(interaction.channel.id).send({ embeds: [embed] })
    }
}