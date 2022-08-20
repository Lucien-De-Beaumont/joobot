const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");

module.exports = {
    name: "ticket",
    description: "Envoie l'embed de création de ticket",
    dmPermission: false,
    hidden: false,
    helpType: "fun",

    runInteraction(client, interaction) {
        try { eval('config.guild_' + channel.guild.id + ".channels['ticket']"); eval('config.guild_' + interaction.guild.id + ".perms['mecano']") } catch (err) { return Logger.debug('fatal error occured:' + err)}

        if (!interaction.member.roles.cache.some(r => eval('config.guild_' + interaction.guild.id + ".perms['mecano']").includes(r.id))) { return interaction.reply({ content: `Vous n'avez pas les permissions nécessaires !`, ephemeral: true }) }

        const embed = new Discord.MessageEmbed()
            .setTitle(`Envoyer un ticket à l'équipe de modération`)
            .setThumbnail(`${interaction.guild.iconURL()}`)
            .setTimestamp()
            .setDescription(`Utilisez le bouton ci-dessous pour envoyer un ticket à notre équipe de modération, qui l'étudiera dans les plus brefs délais !`)

        const ticketMenu = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('ticket-menu')
                    .setPlaceholder('Sélectionner une raison...')
                    .addOptions([
                        {
                            label: 'Fiche RP',
                            description: 'Soumettre une fiche RP.',
                            value: 'ficherp',
                            emoji: '📝'
                        },
                        {
                            label: 'Demande de création de lieu',
                            description: 'Demander la création d\'un lieu pour RP.',
                            value: 'locationcreate',
                            emoji: '📍'
                        },
                        {
                            label: 'Question',
                            description: 'Poser une question à l\'équipe de modération.',
                            value: 'question',
                            emoji: '❓'
                        },
                        {
                            label: 'Signalement',
                            description: 'Faire un signalement sur un membre, une faille ou un dysfonctionnement.',
                            value: 'report',
                            emoji: '⚠️'
                        },
                        {
                            label: 'Idée',
                            description: 'Proposer une idée pour le serveur.',
                            value: 'lightbulb',
                            emoji: '💡'
                        },

                    ]),
            )
        client.channels.cache.get(eval('config.guild_' + message.guild.id + '.channels[\'ticket\']')).send({ embeds: [embed], components: [ticketMenu] })
    },
}
