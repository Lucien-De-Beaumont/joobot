const Discord = require('discord.js');
const config = require('../config')
const Logger = require("../utils/Logger");
const db = require('../utils/connectMYSQL')

module.exports = {
    name: 'fifth-step-registering',
    async runInteraction(client, interaction) {

        const embed = new Discord.MessageEmbed()
            .setTitle(`Sélection du rôle`)
            .setDescription(`**Vous arrivez face à une sorte de tablette.\nDessus s'affichent dans un menu déroulant 3 catégories majeures, et, pour chacune de ses catégories, 3 roles liés.**`)
            .setTimestamp()
            .setThumbnail(`https://cdn.discordapp.com/icons/1017860185454297088/88e4c406d4d2e9736be3f33afca81df1.webp`)

        const verifButtons = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('fifth-step-registering')
                    .setPlaceholder('Sélectionnez un rôle !')
                    .addOptions(
                        {
                            label: 'Alpha - Brute',
                            description: '+ 5% de force brute',
                            emoji: '👊',
                            value: 'Alpha - Brute',
                        },
                        {
                            label: 'Alpha - Riche',
                            description: '+ 5% de crédits supplémentaires de départ',
                            emoji: '🪙',
                            value: 'Alpha - Riche',
                        },
                        {
                            label: 'Alpha - Athlétique',
                            description: '+ 5% de vitesse',
                            emoji: '💨',
                            value: 'Alpha - Athlétique',
                        },
                        {
                            label: 'Bêta - Fantassin',
                            description: '+ 2% de force',
                            emoji: '🔪',
                            value: 'Bêta - Fantassin',
                        },
                        {
                            label: 'Bêta - Protecteur',
                            description: '+ 2% de résistance',
                            emoji: '🛡️',
                            value: 'Bêta - Protecteur',
                        },
                        {
                            label: 'Bêta - Eclaireur',
                            description: '+ 3% d\'acuité visuelle',
                            emoji: '🔭',
                            value: 'Bêta - Eclaireur',
                        },
                        {
                            label: 'Omega - Solitaire',
                            description: '- 2% de force',
                            emoji: '🩸',
                            value: 'Omega - Solitaire',
                        },
                        {
                            label: 'Omega - Mendiant',
                            description: '- 2% de faim',
                            emoji: '🍗',
                            value: 'Omega - Mendiant',
                        },
                        {
                            label: 'Omega - Frêle',
                            description: '- 2% dans toutes les compétences\nIncroyablement mignon',
                            emoji: '✨',
                            value: 'Omega - Frêle',
                        },
                    ),
            )

        const [results0] = await db.query(`SELECT * FROM Icon99 WHERE discordid=${db.escape(interaction.member.id)} AND isbot='FALSE'`);

        const embed1 = new Discord.MessageEmbed()
            .setTitle(`Fiche RP - Carte d'identité`)
            .setThumbnail(`${results0[0].iconURL}`)
            .setDescription(`Voici la fiche RP soumise par ${interaction.member.displayName} ( <@${interaction.member.id}> )`)
            .addFields(
                { name: `Nom`, value: `${results0[0].nom}`, inline: true },
                { name: `Age`, value: `${results0[0].age} ans`, inline: true },
                { name: `Genre`, value: `${results0[0].genre}`, inline: true },
                { name: `Taille`, value: `${Math.floor(parseInt(results0[0].taille) / 100)}m ${parseInt(results0[0].taille) - (Math.floor(parseInt(results0[0].taille) / 100) * 100)}cm \`(${results0[0].taille}cm)\``, inline: true },
                { name: `Poids`, value: `${results0[0].poids} kilos`, inline: true },
                { name: `Rôle`, value: `${interaction.values[0]}`, inline: true },
            )
            .setFooter({ text: interaction.member.id })

        const embed2 = new Discord.MessageEmbed()
            .setTitle(`Fiche RP - Partie physique`)
            .setDescription(`${results0[0].physique}`)

        const embed3 = new Discord.MessageEmbed()
            .setTitle(`Fiche RP - Partie mentale`)
            .setDescription(`${results0[0].mental}`)

        const embed4 = new Discord.MessageEmbed()
            .setTitle(`Fiche RP - Partie goûts`)
            .setDescription(`${results0[0].gouts}`)

        const embed5 = new Discord.MessageEmbed()
            .setTitle(`Fiche RP - Partie histoire`)
            .setDescription(`${results0[0].histoire}`)
            .setTimestamp()
            .setFooter({ text: `Pour rappel, le rôle demandé est ${interaction.values[0]}` })

        verifEmbeds = [embed1, embed2, embed3, embed4, embed5]
        if (interaction.channel.id != '1018859112559296542') {
            client.channels.cache.get('1018859112559296542').send({ embeds: verifEmbeds, components: [verifButtons] })
            interaction.reply({ content: `Votre demande pour passer en rôle ${interaction.values[0]} a bien été transmise !\nVous aurez accès au salon <#1018130283939254292> une fois la demande complétée.\n\nVous recevrez également un message privé pour vous indiquer le rôle de votre avatar sous peu.`, ephemeral: true })
        } else {
            db.query(`UPDATE Icon99 SET role='${interaction.values[0]}' WHERE discordid = '${interaction.message.embeds[0].footer.text}' AND isbot='FALSE'`);
            interaction.reply({ content: `Fiche validée !`, ephemeral: true })
            interaction.guild.members.cache.get(interaction.message.embeds[0].footer.text).roles.remove(config.roles.creation['role'])
            interaction.guild.members.cache.get(interaction.message.embeds[0].footer.text).roles.add(config.roles.creation['welcome'])
            interaction.guild.members.cache.get(interaction.message.embeds[0].footer.text).send(`Votre fiche RP pour ${interaction.message.embeds[0].fields[0].value} a été validée !\nAprès réflexion et recherche de logique avec la fiche, ${interaction.message.embeds[0].fields[0].value} sera un ${interaction.values[0]}.`)
            interaction.message.edit({components: []})
        }
        client.channels.cache.get('1018126920522670180').messages.fetch({ limit: 1 }).then(messages => {
            let lastMessage = messages.first();
            client.channels.cache.get('1018126920522670180').messages.fetch(`${lastMessage.id}`).then(message => message.edit({ embeds: [embed], components: [verifButtons] }))
        })
    }
};