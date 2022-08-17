const Discord = require("discord.js");
const config = require("../config");
const db = require("../utils/connectMYSQL");

module.exports = {
    name: "avatar",
    description: "Attribuer un avatar à un personnage RP",
    role: [config.guild],
    hidden: false,
    helpType: "fun",
    underConstruction: false,
    options: [{
        name: "prefixe",
        description: "Par quelle portion de texte devra commencer votre message pour que votre personnage parle ?",
        required: true,
        type: "STRING"
    }],

    async runInteraction(client, interaction) {
        let prefix = interaction.options.getString('prefixe')
        db.query(`SELECT * FROM webhook WHERE prefix = ${db.escape(prefix)} AND discordid = ${db.escape(interaction.member.id)}`, function (err, results) {
            if (!results && results.length) { return interaction.reply(`Aucun de vos personnages n'est enregistré avec le préfixe suivant : ${prefix}`) }
            interaction.reply(`Merci d'envoyer l'image qui servira d'avatar pour ${results[0].nom} !\nExpire <t:${Math.floor(new Date().getTime() / 1000) + 60}:R>.`)
            const filter = msg => msg.author.id == interaction.member.id
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000 })

            collector.on('collect', async collected => {
                let URL = collected.attachments.map(c => c)[0].url
                interaction.followUp(`L'image suivante sera utilisée pour RP avec ${results[0].nom} :`)
                setTimeout(() => interaction.channel.send(`${URL}`), 100)
                db.query(`UPDATE webhook SET iconURL = '${URL}' WHERE prefix = ${db.escape(prefix)} AND discordid = ${db.escape(interaction.member.id)}`)
                let message = await interaction.fetchReply()
                message.edit(`Requête de changement d'avatar complétée !`)
                collected.delete()
                collector.stop()
            })
        })
    },
}
