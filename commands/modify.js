const Discord = require("discord.js");
const config = require("../config");
const db = require('../utils/connectMYSQL');

module.exports = {
    name: "modify",
    roles: [config.perms['wholeStaff']],
    description: "Modifier l'un de ses personnages RP",
    dmPermission: true,
    hidden: false,
    options: [{
        name: "prefixe",
        description: "Quel est le préfixe du personnage à modifier ?",
        required: true,
        type: "STRING",
    }, {
        name: "option",
        description: "Que souhaitez vous modifier ?",
        required: true,
        type: "STRING",
        choices: [
            { name: 'Préfixe', value: 'prefix' },
            { name: 'Nom', value: 'nom' },
        ]
    }, {
        name: "donnee",
        description: "Quel doit-être le nouveau préfixe / lien de l'avatar du bot ?",
        required: true,
        type: "STRING",
    }],
    helpType: "fun",

    async runInteraction(client, interaction) {
        let prefix = interaction.options.getString("prefixe")
        let option = interaction.options.getString("option")
        let newParameter = interaction.options.getString("donnee")

        const [results0] = await db.query(`SELECT * FROM Icon99 WHERE discordid = ${db.escape(interaction.user.id)} AND prefix=${db.escape(prefix)}`)
        if (!(results0.length && results0)) return interaction.reply(`Vous n'avez pas de personnage avec le préfixe suivant : \`${prefix}\``)
        if (results0[0].prefix == newParameter) {
            return interaction.reply(`Vous avez déjà un personnage avec le préfixe suivant : \`${prefix}\``)
        }
        if (results0[0].nom == newParameter) {
            return interaction.reply(`Vous avez déjà un personnage avec le nom suivant : \`${prefix}\``)
        }
        db.query(`UPDATE Icon99 SET ${db.escape(option).slice(1, db.escape(option).length - 1)} = ${db.escape(newParameter)} WHERE discordid = ${db.escape(interaction.user.id)} AND prefix=${db.escape(prefix)}`)
        const embed = new Discord.MessageEmbed()
            .setTitle(`Mise à jour de ${results0[0].nom} effectuée`)
            .setTimestamp()
            .setThumbnail(`${results0[0].iconURL}`)
            .addFields({ name: `Ancien ${option}`, value: `${eval('results0[0].' + option)}`, inline: false },
                { name: `Nouveau ${option}`, value: `${newParameter}`, inline: false })
        interaction.reply({ embeds: [embed] })
    },
}
