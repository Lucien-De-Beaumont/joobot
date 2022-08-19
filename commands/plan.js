const Discord = require("discord.js");
const config = require("../config");

module.exports = {
    name: "plan",
    description: "Envoie le plan des salons",
    hidden: false,
    helpType: "moderation",

    runInteraction(client, interaction) {
        if(!interaction.member.roles.cache.some(r => eval('config.guild_'+interaction.guild.id+".perms['mecano']").includes(r.id))){ return interaction.reply({content: `Vous n'avez pas les permissions nécessaires !`, ephemeral: true})}
        if (typeof (eval('config.guild_' + channel.guild.id + ".channels['plan-environs']")) != 'string' || typeof eval('config.guild_' + channel.guild.id + ".zones.categories") == 'undefined') { return }
        const embed = new Discord.MessageEmbed()
            .setTitle(`Plan des environs`)
            .setTimestamp()
            .setThumbnail(`${interaction.guild.iconURL()}`)
            .setFooter({ text: 'Utilise ce plan pour connaître les différentes zones accessibles !', iconURL: `${client.user.displayAvatarURL()}` });
        let description = ""

        for (categoryID in eval('config.guild_' + channel.guild.id + ".zones.categories")) {
            description = description + '\n\n' + client.channels.cache.get(`${eval('config.guild_' + channel.guild.id + ".zones.categories" + [categoryID])}`).name + '\n'
            client.channels.cache.get(`${eval('config.guild_' + channel.guild.id + ".zones.categories" + [categoryID])}`).children.map(c => c).sort((a, b) => a.rawPosition - b.rawPosition).forEach(channel => {
                description = description + '\n<#' + channel.id + '>'
            })
        }

        embed.setDescription(description)
        client.channels.cache.get(eval('config.guild_' + message.guild.id + '.channels[\'plan-environs\']')).send({ embeds: [embed] })
    }
}