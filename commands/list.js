const Discord = require("discord.js");
const config = require("../config");
const db = require('../utils/connectMYSQL');
const date = require('date-and-time');

module.exports = {
    name: "list",
    roles: [config.guild],
    description: "Voir la liste des personnages d'un membre",
    hidden: false,
    options: [{
        name: "membre",
        description: "Quel est la personne dont vous souhaitez voir les personnages ?",
        required: false,
        type: "USER"
    }],
    helpType: "moderation",

    async runInteraction(client, interaction) {
        let membre = interaction.options.getMember("membre")
        if (membre === null) {
            membre = interaction.member
        }
        const [results0] = await db.query(`SELECT * FROM Icon99 WHERE discordid=${db.escape(membre.id)} AND isbot = 'FALSE' ORDER BY nom ASC`)
        if (!(results0 && results0.length)) { return interaction.reply(`${membre.displayName} n'a aucune personnage RP pour le moment`) }
        const listEmbed = new Discord.MessageEmbed()
            .setTitle(`Personnages de ${membre.displayName}`)
            .setThumbnail(`${membre.displayAvatarURL()}`)
            .setAuthor({ name: `Demandé par ${interaction.member.displayName}`, iconURL: `${interaction.member.displayAvatarURL()}` })
            .setColor('#FFFF00')
            .setFooter({ text: `Page 1 sur ${Math.ceil(results0.length / 5)}` })
            .setTimestamp()

        for (element in results0) {
            if (element <= 4) {
                listEmbed.addFields({ name: `${results0[element].nom}`, value: `Préfixe : \`${results0[element].prefix}\`\nLien de l'avatar : ${results0[element].iconURL}\nDate de création : <t:${Math.floor(new Date(results0[element].date).getTime() / 1000)}:R>, le <t:${Math.floor(new Date(results0[element].date).getTime() / 1000)}:f>`, inline: false })
            }
        }

        const buttons = new Discord.MessageActionRow()

        if (Math.ceil(results0.length / 5) > 1) {
            buttons.addComponents(
                new Discord.MessageButton()
                    .setCustomId('choose-page-button')
                    .setLabel('Recherche')
                    .setEmoji('🔎')
                    .setStyle('SUCCESS'),
                new Discord.MessageButton()
                    .setCustomId('next-page-button')
                    .setLabel('Page suivante')
                    .setEmoji('▶️')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('last-page-button')
                    .setLabel('Dernière page')
                    .setEmoji('⏭️')
                    .setStyle('PRIMARY'),
            )
        }
        if (buttons.components.length > 0) {
            interaction.reply({ embeds: [listEmbed], components: [buttons] })
        } else {
            interaction.reply({ embeds: [listEmbed] })
        }
    }
}