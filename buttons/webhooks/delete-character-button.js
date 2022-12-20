const config = require("../../config");
const Discord = require("discord.js");
const db = require('../../utils/connectMYSQL')
const date = require('date-and-time');

module.exports = {
    name: "delete-character-button",
    roles: [config.perms['wholeStaff']],

    async runInteraction(client, interaction) {
        interaction.deferUpdate()
        const message = await interaction.fetchReply()
        await db.query(`DELETE FROM Icon99 WHERE discordid = ${db.escape(message.embeds[0].fields[2].value)} AND prefix=${db.escape(message.embeds[0].fields[1].value)}`);
        if (interaction.user.id != message.embeds[0].fields[2].value) { return interaction.reply({ content: `Vous ne pouvez pas réagir à ce bouton !`, ephemeral: true }) }
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.embeds[0].title}`)
            .setDescription(`Personnage supprimé !`)
            .setTimestamp()
            .setColor(`#FF0000`)
            .setThumbnail(`${message.embeds[0].thumbnail.url}`)
        message.embeds[0].fields.forEach(element => {
            embed.addFields({ name: element.name, value: element.value, inline: element.inline })
        });
        message.delete()
        interaction.channel.send({ embeds: [embed] })
    }
}  