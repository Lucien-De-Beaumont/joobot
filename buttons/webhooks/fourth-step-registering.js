const config = require("../../config");
const Discord = require("discord.js");
const db = require('../../utils/connectMYSQL')

module.exports = {
    name: "fourth-step-registering",
    roles: [config.guild],

    async runInteraction(client, interaction) {
        const embed2 = new Discord.MessageEmbed()
            .setTitle(`Photomaton`)
            .setThumbnail('https://cdn.discordapp.com/icons/1017860185454297088/88e4c406d4d2e9736be3f33afca81df1.webp')
            .setDescription(`Merci de placer votre visage en face de l'appareil !\n\n||Merci de fournir une photo de votre personnage.\nExpire <t:${Math.floor(new Date().getTime() / 1000) + 60}:R>.||`)

        interaction.reply({ embeds: [embed2], ephemeral: true })

        const message = await interaction.fetchReply()
        const filter = msg => msg.author.id == interaction.user.id
        const collector = interaction.channel.createMessageCollector({ filter, time: 60000 })
        const embed = new Discord.MessageEmbed()
            .setTitle(`Photo prise`)
            .setTimestamp()

        collector.on('collect', async collected => {
            let URL = await client.channels.cache.get('1018929050879803522').send({files: [new Discord.MessageAttachment(collected.attachments.map(c => c)[0].url)]})
            embed.setImage(`${URL.attachments.map(c => c)[0].url}`)
            collected.delete()
            interaction.followUp({ embeds: [embed], ephemeral: true })
            db.query(`UPDATE Icon99 SET iconURL = '${URL.attachments.map(c => c)[0].url}' AND isbot = 'FALSE' WHERE discordid = ${db.escape(interaction.user.id)}`)
            interaction.member.roles.remove(config.roles.creation['photo'])
            interaction.member.roles.add(config.roles.creation['role'])
            collector.stop()
        })
    }
}