const Discord = require("discord.js");
const config = require("../config");
const db = require('../utils/connectMYSQL');

module.exports = {
    name: "delete",
    description: "Supprimer l'un de ses personnages RP",
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

        db.query(`SELECT * FROM webhook WHERE discordid = ${db.escape(interaction.member.id)} AND prefix=${db.escape(prefix)}`, function (err0, results0) {
            if(!(results0 && results0.length)) return interaction.reply(`Vous n'avez aucun personnage avec ce préfixe !`)
            const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('delete-character-button')
                        .setLabel('❌ | Valider la supression')
                        .setStyle('DANGER'),
                )
            const embed = new Discord.MessageEmbed()
                .setTitle(`Vérification de la suppression de ${results0[0].nom}`)
                .setTimestamp()
                .setThumbnail(`${results0[0].iconURL}`)
                .addField(`Nom du personnage`, `${results0[0].nom}`, false)
                .addField(`Préfixe du personnage`, `${results0[0].prefix}`, false)
                .addField(`Discord ID du propriétaire du personnage`, `${interaction.member.id}`, false)
                .addField(`Date de création`, `<t:${Math.floor(new Date(results0[0].date).getTime() / 1000)}:R>, le <t:${Math.floor(new Date(results0[0].date).getTime() / 1000)}:f>`, false)

            interaction.reply({ embeds: [embed], components: [row] })
        });
    },
}