const Discord = require('discord.js');
const config = require('../config')
const Logger = require("../utils/Logger");

module.exports = {
    name: 'ticket-menu',
    async runInteraction(client, interaction) {

        const embed = new Discord.MessageEmbed()
            .setTitle(`Envoyer un ticket à l'équipe de modération`)
            .setDescription(`Utilisez le bouton ci-dessous pour envoyer un ticket à notre équipe de modération, qui l'étudiera dans les plus brefs délais !`)

        const ticketMenu = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('ticket-menu')
                    .setPlaceholder('Sélectionner une raison...')
                    .addOptions([
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
                            description: 'Signaler un membre, une faille ou un dysfonctionnement.',
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

        let description
        let title

        switch (interaction.values[0]) {
            case 'locationcreate':
                description = `Bonjour <@${interaction.member.id}> !\n\nMerci d'avoir contacté l'équipe de modération pour votre **demande d'ajout d'un lieu RP**. \nAfin que cette dernière ait toutes les chances d'être acceptée, veuillez décrire votre lieu, la zone dans laquelle il pourraît être inclus, une image pour l'accompagner, son utilité [...].\n\nNotre équipe a par ailleurs **déjà** été notifiée de votre demande d'ajout de lieu, merci donc de **ne pas** les mentionner. Une réponse vous sera donnée dans les plus brefs délais.\n\nBonne journée à vous !`;
                title = `Demande de création de lieu`
                break;
            case 'question':
                description = `Bonjour <@${interaction.member.id}> !\n\nMerci d'avoir contacté l'équipe de modération pour la **question** que vous semblez avoir. \n\nNous vous écoutons, quelle est votre question ?\n\nNotre équipe a par ailleurs **déjà** été notifiée que vous aviez une question, merci donc de **ne pas** les mentionner. Une réponse vous sera donnée dans les plus brefs délais.\n\nBonne journée à vous !`;
                title = `Question`
                break;
            case 'report':
                description = `Bonjour <@${interaction.member.id}> !\n\nMerci d'avoir contacté l'équipe de modération concernant votre **signalement**. \n\nNous sommes sincèrement désolés que vous ayez à signaler un problème. Nous ferons évidemment de notre mieux pour régler ça le plus vite possible.\nAfin d'accélerer la vitesse de résolution de votre problème, merci de nous décrire le plus précisément possible votre souci.\n\nNotre équipe a par ailleurs **déjà** été notifiée que vous aviez un problème, merci donc de **ne pas** les mentionner. Une réponse et une solution vous seront apportées dans les plus brefs délais.\n\nBonne journée à vous !`;
                title = `Signalement`
                break;
            case 'lightbulb':
                description = `Bonjour <@${interaction.member.id}> !\n\nMerci d'avoir contacté l'équipe de modération pour nous faire part de votre **idée**. \n\nAfin de pouvoir faciliter le débat et la compréhension, merci de nous décrire le plus précisément possible votre idée.\n\nNotre équipe a par ailleurs **déjà** été notifiée que vous aviez un problème, merci donc de **ne pas** les mentionner. Une réponse et une solution vous seront apportées dans les plus brefs délais.\n\nBonne journée à vous !`;
                title = `Idée`
                break;

        }
        client.channels.cache.get(config.channels['ticket']).messages.fetch({ limit: 1 }).then(messages => {
            let lastMessage = messages.first();
            client.channels.cache.get(config.channels['ticket']).messages.fetch(`${lastMessage.id}`).then(message => message.edit({ embeds: [embed], components: [ticketMenu] }))
        })

        const embed2 = new Discord.MessageEmbed()
            .setTitle(`Nouveau ticket : ${title}`)
            .setDescription(`${description}`)
            .setThumbnail(`${interaction.guild.iconURL()}`)
            .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
            .setTimestamp()

        const buttons = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('close-ticket')
                    .setLabel('Fermer le ticket')
                    .setEmoji('🔐')
                    .setStyle('DANGER')
            )

        let permsArray = [{
            id: interaction.guild.id,
            deny: ['VIEW_CHANNEL'],
        },
        {
            id: interaction.member.id,
            allow: ['VIEW_CHANNEL'],
        }]
        for (element of config.perms['wholeStaff']) {
            let perms = new Object()
            perms.id = eval("'" + element + "';")
            perms.allow = ["VIEW_CHANNEL"]
            permsArray.push(perms)
        }
        client.channels.cache.get(config.channels['category-ticket']).createChannel(
            `ticket-${interaction.member.displayName}-${Math.round(Math.random() * 100)}`, {
            permissionOverwrites: permsArray,
        }).then(channel => {
            channel.send({ embeds: [embed2], components: [buttons] });
            interaction.reply({ content: `Votre ticket ( <#${channel.id}> ) a bien été créé !\nUn staff s'occupera de vous dès que possible !`, ephemeral: true });
            channel.send('<@&' + config.perms['wholeStaff'].join('>, <@&') + '>').then(msg => {
                msg.delete()
            })
        })

    }
};