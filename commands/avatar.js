const Discord = require("discord.js");
const config = require("../config");
const db = require("../utils/connectMYSQL");

module.exports = {
    name: "avatar",
    description: "Attribuer un avatar à un personnage RP",
    role: [config.guild],
    hidden: false,
    helpType: "fun",
    both: true,
    options: [{
        name: "prefixe",
        description: "Par quelle portion de texte devra commencer votre message pour que votre personnage parle ?",
        required: true,
        type: "STRING"
    }],

    async runInteraction(client, interaction) {
        let prefix = interaction.options.getString('prefixe')
        db.query(`SELECT * FROM webhook WHERE prefix = ${db.escape(prefix)} AND discordid = ${db.escape(interaction.member.id)}`, function (err, results) {
            if (!results[0]) { return interaction.reply(`Aucun de vos personnages n'est enregistré avec le préfixe suivant : ${prefix}`) }
            const embed2 = new Discord.MessageEmbed()
                .setTitle(`Modification de l'avatar d'un personnage`)
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setDescription(`Merci d'envoyer l'image qui servira d'avatar pour ${results[0].nom}.\nExpire <t:${Math.floor(new Date().getTime() / 1000) + 60}:R>.`)
            const filter = msg => msg.author.id == interaction.member.id
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000 })
            const embed = new Discord.MessageEmbed()
                .setTitle(`Avatar de ${results[0].nom} mis à jour`)
                .setDescription(`L'image suivante sera utilisée pour RP avec ${results[0].nom} :\n_La suppression de l'image envoyée, du salon ou du serveur dans lequel elle a été envoyée occasionnerait l'impossibilité de charger l'image à l'avenir._`)
                .setTimestamp()

            interaction.reply({ embeds: [embed2] })
            collector.on('collect', async collected => {
                let URL = collected.attachments.map(c => c)[0].url
                embed.setImage(`${URL}`)
                interaction.followUp({ embeds: [embed] })
                db.query(`UPDATE webhook SET iconURL = '${URL}' WHERE prefix = ${db.escape(prefix)} AND discordid = ${db.escape(interaction.member.id)}`)
                let message = await interaction.fetchReply()
                message.edit(`Requête de changement d'avatar complétée !`)
                collector.stop()
            })
        })
    },
    async run(client, message) {
        const embed1 = new Discord.MessageEmbed()
            .setTitle(`Modification de l'avatar d'un personnage`)
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setDescription(`Merci de fournir le préfixe de votre personnage.\nExpire <t:${Math.floor(new Date().getTime() / 1000) + 60}:R>.`)

        const filter = msg => msg.channel.type == 'DM' && msg.author.id == message.author.id
        message.channel.send({ embeds: [embed1] }).then(async msg => {
            const collectorPrefix = msg.channel.createMessageCollector({ filter, time: 60000 })

            collectorPrefix.on('collect', async prefix => {
                db.query(`SELECT * FROM webhook WHERE prefix = ${db.escape(prefix.content)} AND discordid = ${db.escape(message.author.id)}`, function (err, results) {
                    collectorPrefix.stop()
                    if (!results[0]) { return message.channel.send(`Aucun de vos personnages n'est enregistré avec le préfixe suivant : ${prefix}`) }
                    const embed2 = new Discord.MessageEmbed()
                        .setTitle(`Modification de l'avatar d'un personnage`)
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription(`Merci d'envoyer l'image qui servira d'avatar pour ${results[0].nom}.\nExpire <t:${Math.floor(new Date().getTime() / 1000) + 60}:R>.`)
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Avatar de ${results[0].nom} mis à jour`)
                        .setDescription(`L'image suivante sera utilisée pour RP avec ${results[0].nom} :\n_La suppression de l'image envoyée, du salon ou du serveur dans lequel elle a été envoyée occasionnerait l'impossibilité de charger l'image à l'avenir._`)
                        .setTimestamp()
                    message.channel.send({ embeds: [embed2] }).then(async msg => {
                        const collectorAvatar = msg.channel.createMessageCollector({ filter, time: 60000 })
                        collectorAvatar.on('collect', async avatar => {
                            let URL = avatar.attachments.map(c => c)[0].url
                            embed.setImage(`${URL}`)
                            message.channel.send({ embeds: [embed] })
                            db.query(`UPDATE webhook SET iconURL = '${URL}' WHERE prefix = ${db.escape(prefix.content)} AND discordid = ${db.escape(message.author.id)}`)
                            collectorAvatar.stop()
                        })
                    })
                })
            })
        }
        )
    }
}