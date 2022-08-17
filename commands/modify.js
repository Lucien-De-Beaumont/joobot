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
            { name: 'Préfixe', value: 'prefix' },
            { name: 'Nom', value: 'nom' },
            { name: 'Avatar', value: 'iconURL' },
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

        function isImage(url) {
            return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
        }

        if (option == 'iconURL' && !isImage(newParameter)) { return interaction.reply({ content: `Oops! Ce lien ne semble pas rediriger vers une image ( formats autorisés : \`jpg|jpeg|png|webp|avif|gif|svg\` )!`, ephemeral: true }) }

        db.query(`SELECT * FROM webhook WHERE discordid = ${db.escape(interaction.member.id)} AND prefix=${db.escape(prefix)}`, function (err0, results0) {
            if (!(results0.length && results0)) return interaction.reply(`Vous n'avez pas de personnage avec le préfixe suivant : \`${prefix}\``)
            db.query(`UPDATE webhook SET ${db.escape(option).slice(1, db.escape(option).length - 1)} = ${db.escape(newParameter)} WHERE discordid = ${db.escape(interaction.member.id)} AND prefix=${db.escape(prefix)}`, function (err1, results1) {
                if (err1) return console.log(err1)
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Mise à jour de ${results0[0].nom} effectuée`)
                    .setTimestamp()
                    .setThumbnail(`${results0[0].iconURL}`)
                    .addField(`Ancien ${db.escape(option)}`, `${eval('results0[0].' + db.escape(option))}`, false)
                    .addField(`Nouveau ${db.escape(option)}`, `${db.escape(newParameter)}`, false)

                interaction.reply({ embeds: [embed] })
            });
        });
    },
}
