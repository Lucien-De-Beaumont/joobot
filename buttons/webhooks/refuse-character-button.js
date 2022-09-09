const config = require("../../config");
const Discord = require("discord.js");
const db = require('../../utils/connectMYSQL')

module.exports = {
    name: "refuse-character-button",
    roles: [config.guild],

    async runInteraction(client, interaction) {
        interaction.deferUpdate()
        const message = await interaction.fetchReply()

        if (message.embeds[0].description.includes('<@&')) {
            if (interaction.user.id != message.embeds[0].fields[3].value) { return interaction.reply({ content: `Vous ne pouvez pas réagir à ce bouton !`, ephemeral: true }) }

            const embed = new Discord.MessageEmbed()
                .setTitle(`${message.embeds[0].title}`)
                .setDescription(`La création du personnage a été stoppée !`)
                .setTimestamp()
                .setColor(`#FF0000`)
                .setThumbnail(`${message.embeds[0].thumbnail.url}`)
            message.embeds[0].fields.forEach(element => {
                embed.addFields({name: element.name, value: element.value, inline: element.inline})
            });
            message.delete()
            interaction.channel.send({ embeds: [embed] })
        } else {
            if (interaction.user.id != message.embeds[0].fields[3].value) { return interaction.followUp({ content: `Vous ne pouvez pas réagir à ce bouton !`, ephemeral: true }) }

            const embed = new Discord.MessageEmbed()
                .setTitle(`${message.embeds[0].title}`)
                .setDescription(`La création du personnage a été stoppée !`)
                .setTimestamp()
                .setColor(`#FF0000`)
                .setThumbnail(`${message.embeds[0].thumbnail.url}`)
            message.embeds[0].fields.forEach(element => {
                embed.addFields({name: element.name, value: element.value, inline: element.inline})
            });
            message.delete()
            interaction.channel.send({ embeds: [embed] })
        }
    }
}  