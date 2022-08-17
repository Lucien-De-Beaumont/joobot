const config = require("../../config");
const Discord = require("discord.js");
const db = require('../../utils/connectMYSQL')
const date = require('date-and-time');

module.exports = {
    name: "validate-character-button",
    role: [config.guild],

    async runInteraction(client, interaction) {
        interaction.deferUpdate()
        const message = await interaction.fetchReply()

        if (interaction.member.id != message.embeds[0].fields[3].value) { return interaction.reply({ content: `Vous ne pouvez pas réagir à ce bouton !`, ephemeral: true }) }
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.embeds[0].title}`)
            .setDescription(`Personnage RP créé !`)
            .setTimestamp()
            .setColor(`#00FF00`)
            .setThumbnail(`${message.embeds[0].thumbnail.url}`)
        message.embeds[0].fields.forEach(element => {
            embed.addField(element.name, element.value, element.inline)
        });
        message.delete()
        interaction.channel.send({ embeds: [embed] })

                db.query(`INSERT INTO webhook SET nom = ${db.escape(embed.fields[0].value)}, prefix = ${db.escape(embed.fields[1].value)}, iconURL = ${db.escape(embed.fields[2].value)}, date=${db.escape(date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'))}, discordid=${db.escape(interaction.member.id)}`, function (err, results) {
                    if (err) { return console.log(err) }
            })
    }
}  