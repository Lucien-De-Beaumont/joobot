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

        message.channel.createWebhook(`${embed.fields[0].value}`, { avatar: "https://i.imgur.com/p2qNFag.png" })
            .then(wb => {
                db.query(`INSERT INTO webhook SET nom = '${embed.fields[0].value}', prefix = '${embed.fields[1].value}', webhookURL= '${wb.url}', iconURL = '${embed.fields[2].value}', date='${date.format(new Date(), 'DD/MM/YYYY HH:mm:ss')}', discordid='${interaction.member.id}'`, function (err, results) {
                    if (err) { return console.log(err) }
                })
            })
            .catch(console.error);
    }
}  