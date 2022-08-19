const config = require("../../config");
const Discord = require("discord.js");

module.exports = {
    name: "close-ticket",

    async runInteraction(client, interaction) {
        interaction.deferUpdate()
        const message = await interaction.fetchReply()
        let discordIDmember = (message.embeds[0].author.iconURL.slice(message.embeds[0].author.iconURL.slice(0, message.embeds[0].author.iconURL.lastIndexOf('/')).lastIndexOf('/') + 1, message.embeds[0].author.iconURL.slice(0, message.embeds[0].author.iconURL.lastIndexOf('/')).length))
        let typeOfTicket = message.embeds[0].title.toString().slice(message.embeds[0].title.toString().indexOf(': ') + 2)

        if (typeof (eval('config.guild_' + interaction.guild.id + ".channels['transcript-ticket']")) != 'string') { return }
        const transcriptEmbed = new Discord.MessageEmbed()
            .setTitle(`Ticket fermé`)
            .setTimestamp()
            .setThumbnail(`${interaction.guild.iconURL()}`)
            .addFields({
                name: '#️⃣ ID du ticket', value: interaction.channel.name.slice(interaction.channel.name.lastIndexOf('-') + 1, interaction.channel.name.length, true)
            }, {
                name: '💠 Type de ticket', value: typeOfTicket, inline: true
            }, {
                name: '🙋 Ouvert par', value: '<@' + discordIDmember + '>', inline: true
            }, {
                name: '🤵 Fermé par', value: '<@' + interaction.member.id + '>', inline: true
            }, {
                name: '🔓 Ouvert le', value: `<t:${Math.floor(interaction.channel.createdTimestamp / 1000)}:f>, <t:${Math.floor(interaction.channel.createdTimestamp / 1000)}:R>`, inline: true
            }, {
                name: '🔐 Fermé le', value: `<t:${Math.floor(new Date().getTime() / 1000)}:f>, <t:${Math.floor(new Date().getTime() / 1000)}:R>`, inline: true
            }
            )
        interaction.channel.delete()
        client.channels.cache.get(eval('config.guild_' + message.guild.id + '.channels[\'transcript-ticket\']')).send({ embeds: [transcriptEmbed] })
    }
}  