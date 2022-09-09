const config = require("../../config");
const Discord = require("discord.js");
const db = require('../../utils/connectMYSQL')
const date = require('date-and-time');

module.exports = {
    name: "choose-page-button",
    roles: [config.guild],
    async runInteraction(client, interaction) {
        interaction.deferUpdate()
        const message = await interaction.fetchReply()
        let fieldOfSearch

        if (interaction.member.displayName != message.embeds[0].author.name.slice('Demandé par '.length)) { return interaction.followUp({ content: `Vous ne pouvez pas réagir à ce bouton !`, ephemeral: true }) }

        const filter = msg => msg.author.id == interaction.member.id
        const collector = interaction.channel.createMessageCollector({ filter, time: 120000 })

        interaction.channel.send(`<@${interaction.member.id}>, quel nom souhaitez vous rechercher ?`)
        collector.on('collect', async collected => {
            fieldOfSearch = db.escape('%' + collected.content + '%')
            collector.stop()

            const [results0] = await db.query(`SELECT * FROM webhook WHERE discordid=${db.escape(interaction.guild.members.cache.find(member => member.displayAvatarURL() == message.embeds[0].thumbnail.url).id)} AND nom LIKE ${fieldOfSearch} ORDER BY nom ASC LIMIT 5`);

            const listEmbed = new Discord.MessageEmbed()
                .setTitle(message.embeds[0].title)
                .setThumbnail(message.embeds[0].thumbnail.url)
                .setAuthor({ name: message.embeds[0].author.name, iconURL: message.embeds[0].author.iconURL })
                .setColor(message.embeds[0].color)
                .setFooter({ text: `Page 1 sur ${Math.ceil(results0.length / 5)}` })
                .setTimestamp()

            for (element in results0) {
                listEmbed.addFields({ name: `${results0[element].nom}`, value: `Préfixe : \`${results0[element].prefix}\`\nLien de l'avatar : ${results0[element].iconURL}\nDate de création : <t:${Math.floor(new Date(results0[element].date).getTime() / 1000)}:R>, le <t:${Math.floor(new Date(results0[element].date).getTime() / 1000)}:f>`, inline: false })
            }

            const buttons = new Discord.MessageActionRow()

            if (Math.ceil(results0.length / 5) >= 1) {
                buttons.addComponents(
                    new Discord.MessageButton()
                        .setCustomId('unused-button')
                        .setLabel('Affinez votre recherche pour des résultats plus détaillés !')
                        .setEmoji('🔎')
                        .setDisabled(true)
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId('unused2-button')
                        .setLabel('Champ recherché : ' + fieldOfSearch.slice(2, fieldOfSearch.length - 2))
                        .setEmoji('⌨️')
                        .setDisabled(true)
                        .setStyle('SECONDARY'),
                )
            } else {
                buttons.addComponents(
                    new Discord.MessageButton()
                        .setCustomId('unused3-button')
                        .setLabel('Aucun résultat !')
                        .setEmoji('❌')
                        .setDisabled(true)
                        .setStyle('DANGER'),
                    new Discord.MessageButton()
                        .setCustomId('unused4-button')
                        .setLabel('Champ recherché : ' + fieldOfSearch.slice(2, fieldOfSearch.length - 2))
                        .setEmoji('⌨️')
                        .setDisabled(true)
                        .setStyle('SECONDARY'),
                )
            }

            if (buttons.components.length > 0) {
                message.edit({ embeds: [listEmbed], components: [buttons] })
            } else {
                message.edit({ embeds: [listEmbed] })
            }
        })

    }
}  