// const Discord = require("discord.js");
// const config = require("../config");
// const db = require('../utils/connectMYSQL');
// const date = require('date-and-time');

// module.exports = {
//     name: "list",
//     description: "Voir la liste des personnages d'un membre",
//     hidden: false,
//     options: [{
//         name: "membre",
//         description: "Quel est la personne dont vous souhaitez voir les personnages ?",
//         required: false,
//         type: "USER"
//     }],
//     helpType: "moderation",

//     async runInteraction(client, interaction) {
//         let membre = interaction.options.getMember("membre")
//         if (membre === null) {
//             membre = interaction.member
//         }
//         const [results0] = await db.query(`SELECT * FROM webhook WHERE discordid=${db.escape(membre.id)}`)
//         if (!(results0 && results0.length)) { return interaction.reply(`${membre.displayName} n'a aucune personnage RP pour le moment`) }
//         const infoEmbed = new Discord.MessageEmbed()
//             .setTitle(`Personnages de ${membre.displayName}`)
//             .setThumbnail(`${membre.displayAvatarURL()}`)
//             .setAuthor({ name: `Demandé par ${interaction.member.displayName}`, iconURL: `${interaction.member.displayAvatarURL()}` })
//             .setColor('#FFFF00')
//             .setFooter({text: `Page 1 sur ${Math.ceil(results0.length / 5)}`})
//             .setTimestamp()

//         for (element of results0) {
//             infoEmbed.addFields({ name: `${element.nom}`, value: `Préfixe : \`${element.prefix}\`\nLien de l'avatar : ${element.iconURL}\nDate de création : <t:${Math.floor(new Date(element.date).getTime() / 1000)}:R>, le <t:${Math.floor(new Date(element.date).getTime() / 1000)}:f>`, inline: false })
//         }
//         interaction.reply({ embeds: [infoEmbed] })
//     }
// }