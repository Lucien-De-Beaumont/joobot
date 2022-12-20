const Discord = require("discord.js");
const config = require("../config");
const db = require("../utils/connectMYSQL");

module.exports = {
    name: "avatar",
    roles: [config.perms['wholeStaff']],
    description: "Attribuer un avatar à un personnage RP",
    dmPermission: true,
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
        const [results] = await db.query(`SELECT * FROM Icon99 WHERE prefix = ${db.escape(prefix)} AND discordid = ${db.escape(interaction.user.id)}`)
        if (!results[0]) { return interaction.reply(`Aucun de vos personnages n'est enregistré avec le préfixe suivant : ${prefix}`) }
        if (results[0].isbot == 'FALSE') { return interaction.reply(`Impossible d'éditer ce personnage !`) }
        const embed2 = new Discord.MessageEmbed()
            .setTitle(`Modification de l'avatar d'un personnage`)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`Merci d'envoyer l'image qui servira d'avatar pour ${results[0].nom}.\nExpire <t:${Math.floor(new Date().getTime() / 1000) + 60}:R>.`)
        const filter = msg => msg.author.id == interaction.user.id
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
            db.query(`UPDATE Icon99 SET iconURL = '${URL}' WHERE prefix = ${db.escape(prefix)} AND discordid = ${db.escape(interaction.user.id)}`)
            let message = await interaction.fetchReply()
            message.edit(`Requête de changement d'avatar complétée !`)
            collector.stop()
        })
    },
}