const Discord = require("discord.js");
const config = require("../config");
const db = require('../utils/connectMYSQL');

module.exports = {
    name: "modify",
    description: "Modifier l'un de ses personnages RP",
    role: [config['guild']],
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
            { name: 'Nom', value: 'nom' },
            { name: 'Préfixe', value: 'prefix' },
            { name: 'Avatar', value: 'iconURL' },
        ]
    }, {
        name: "donnee",
        description: "Quel doit-être le nouveau nom / préfixe / lien de l'avatar du bot ?",
        required: true,
        type: "STRING",
    }],
    helpType: "fun",

    runInteraction(client, interaction) {
        let prefix = interaction.options.getString("prefixe")
        let option = interaction.options.getString("option")
        let newParameter = interaction.options.getString("donnee")
        db.query(`SELECT * FROM webhook WHERE discordid = '${interaction.member.id}' AND prefix='${prefix}'`, function (err0, results0) {
            if (!(results0.length && results0)) return interaction.reply(`Vous n'avez pas de personnage avec le préfixe suivant : \`${prefix}\``)
            db.query("UPDATE webhook SET " + option + "='" + newParameter+"'", function (err1, results1) {
                if (err1) return console.log(err1)
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Mise à jour de ${results0[0].nom} effectuée`)
                    .setTimestamp()
                    .setThumbnail(`${results0[0].iconURL}`)
                    .addField(`Ancien ${option}`, `${eval('results0[0].' + option)}`, false)
                    .addField(`Nouveau ${option}`, `${newParameter}`, false)

                interaction.reply({ embeds: [embed] })
            });
        });
    },
}
