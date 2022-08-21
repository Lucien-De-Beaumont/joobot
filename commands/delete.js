const Discord = require("discord.js");
const config = require("../config");
const db = require('../utils/connectMYSQL');

module.exports = {
    name: "delete",
    description: "Supprimer l'un de ses personnages RP",
    dmPermission: true,
    hidden: false,
    options: [{
        name: "prefixe",
        description: "Quel est le préfixe du personnage à supprimer ?",
        required: true,
        type: "STRING",
    }],
    helpType: "fun",

    async runInteraction(client, interaction) {
        let prefix = interaction.options.getString("prefixe")

        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('delete-character-button')
                    .setLabel('❌ | Valider la supression')
                    .setStyle('DANGER'),
            )

        const [results0] = await db.query(`SELECT * FROM webhook WHERE discordid = ${db.escape(interaction.user.id)} AND prefix=${db.escape(prefix)}`)
        if (!(results0 && results0.length)) return interaction.reply(`Vous n'avez aucun personnage avec ce préfixe !`)
        const embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle(`Vérification de la suppression de ${results0[0].nom}`)
            .setThumbnail(`${results0[0].iconURL}`)
            .addFields({ name: `Nom du personnage`, value: `${results0[0].nom}`, inline: false },
                { name: `Préfixe du personnage`, value: `${results0[0].prefix}`, inline: false },
                { name: `Discord ID du propriétaire du personnage`, value: `${interaction.user.id}`, inline: false },
                { name: `Date de création`, value: `<t:${Math.floor(new Date(results0[0].date).getTime() / 1000)}:R>, le <t:${Math.floor(new Date(results0[0].date).getTime() / 1000)}:f>`, inline: false })
        interaction.reply({ embeds: [embed], components: [row] })
    },
}