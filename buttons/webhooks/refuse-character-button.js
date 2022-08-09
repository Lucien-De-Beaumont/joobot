const config = require("../../config");
const Discord = require("discord.js");
const db = require('../../utils/connectMYSQL')

module.exports = {
    name: "refuse-character-button",
    role: [config.guild],

    async runInteraction(client, interaction) {
        interaction.deferUpdate()
        const message = await interaction.fetchReply()

        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.embeds[0].title}`)
            .setDescription(`La création du personnage a été stoppée !`)
            .setTimestamp()
            .setColor(`#FF0000`)
            .setThumbnail(`${message.embeds[0].thumbnail.url}`)
        message.embeds[0].fields.forEach(element => {
            embed.addField(element.name, element.value, element.inline)
        });
        message.delete()
        interaction.channel.send({ embeds: [embed] })
    }
}  