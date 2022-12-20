const config = require("../../config");
const Discord = require("discord.js");
const db = require('../../utils/connectMYSQL')
const date = require('date-and-time');

module.exports = {
    name: "validate-character-button",
    roles: [config.perms['wholeStaff']],

    async runInteraction(client, interaction) {
        interaction.deferUpdate()
        const message = await interaction.fetchReply()

        if (message.embeds[0].description.includes('<@&')) {
            if (interaction.user.id != message.embeds[0].fields[2].value) { return interaction.reply({ content: `Vous ne pouvez pas réagir à ce bouton !`, ephemeral: true }) }
            const embed = new Discord.MessageEmbed()
                .setTitle(`${message.embeds[0].title}`)
                .setDescription(`Personnage RP créé !`)
                .setTimestamp()
                .setColor(`#00FF00`)
            message.embeds[0].fields.forEach(element => {
                embed.addFields({ name: element.name, value: element.value, inline: element.inline })
            });
            message.delete()
            interaction.channel.send({ embeds: [embed] })
            await db.query(`INSERT INTO Icon99 SET nom = ${db.escape(embed.fields[0].value)}, prefix = ${db.escape(embed.fields[1].value)}, date=${db.escape(date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'))}, discordid=${db.escape(interaction.user.id)}`)
        } else {
            if (interaction.user.id != message.embeds[0].fields[2].value) { return interaction.followUp({ content: `Vous ne pouvez pas réagir à ce bouton !`, ephemeral: true }) }
            const embed = new Discord.MessageEmbed()
                .setTitle(`${message.embeds[0].title}`)
                .setDescription(`Personnage RP créé !`)
                .setTimestamp()
                .setColor(`#00FF00`)
            message.embeds[0].fields.forEach(element => {
                embed.addFields({ name: element.name, value: element.value, inline: element.inline })
            });
            message.delete()
            interaction.channel.send({ embeds: [embed] })
            await db.query(`INSERT INTO Icon99 SET nom = ${db.escape(embed.fields[0].value)}, prefix = ${db.escape(embed.fields[1].value)}, isbot='TRUE', date=${db.escape(date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'))}, discordid=${db.escape(interaction.user.id)}`)
        }
    }
}  