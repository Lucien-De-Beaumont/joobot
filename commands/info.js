const Discord = require("discord.js");
const config = require("../config");
const db = require('../utils/connectMYSQL');
const date = require('date-and-time');

module.exports = {
    name: "info",
    description: "Trouver les informations sur un personnage RP",
    hidden: false,
    options: [{
        name: "prefixe",
        description: "Quel est le préfixe du personnage dont vous souhaitez avoir les informations ?",
        required: true,
        type: "STRING"
    }],
    helpType: "moderation",

    runInteraction(client, interaction) {
        if (!interaction) return
        let prefix = interaction.options.getString("prefixe")

        db.query(`SELECT * FROM webhook WHERE prefix=${db.escape(prefix)}`, function (err0, results0) {
            if (!(results0 && results0.length)) { return interaction.reply(`Aucun personnage RP avec le préfixe suivant n'existe : \`${prefix}\``) }
            const infoEmbed = new Discord.MessageEmbed()
                .setTitle("Informations sur " + results0[0].nom)
                .setThumbnail(`${results0[0].iconURL}`)
                .setAuthor({ name: `Demandé par ${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                .addFields({ title: "Nom du personnage", value: `${results0[0].nom}`, inline: false },
                    { title: "Propriétaire", value: `<@${results0[0].discordid}>`, inline: false },
                    { title: `Préfixe`, value: results0[0].prefix, inline: false },
                    { title: "Date de création", value: `<t:${Math.floor(new Date(results0[0].date).getTime() / 1000)}:R>, le <t:${Math.floor(new Date(results0[0].date).getTime() / 1000)}:f>`, inline: false })
                .setColor('#FFFF00')
                .setTimestamp()

            interaction.reply({ embeds: [infoEmbed] })
        })
    }
}
