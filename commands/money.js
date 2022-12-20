const Discord = require("discord.js");
const config = require("../config");
const db = require('../utils/connectMYSQL');

module.exports = {
    name: "money",
    roles: [config.guild],
    description: "Accéder aux informations liées à l'argent",
    dmPermission: false,
    hidden: false,
    options: [{
        name: "commande",
        description: "Que souhaitez vous effectuer ?",
        required: true,
        type: "STRING",
        choices: [
            { name: 'Connaître le nombre de crédits d\'un personnage', value: 'bankaccount' },
            { name: 'Ajouter de l\'argent à un personnage', value: 'addmoney' },
            { name: 'Définir la somme d\'argent d\'un personnage', value: 'setmoney' },
            { name: 'Retirer de l\'argent à un personnage', value: 'removemoney' },
        ]
    }, {
        name: "nom",
        description: "Avec le compte de quel personnage souhaitez-vous intéragir ?",
        required: true,
        type: "STRING",
    }, {
        name: "montant",
        description: "Si nécessaire, quel est le nombre de crédits à créditer / définir / débiter ?",
        required: false,
        type: "INTEGER",
    }],
    helpType: "fun",

    async runInteraction(client, interaction) {
        const commande = interaction.options.getString("commande")
        const nom = interaction.options.getString("nom")
        const montant = interaction.options.getInteger("montant")
        let dbrequest
        if (nom.startsWith('<@') && nom.endsWith('>')) {
            dbrequest = `SELECT * FROM Icon99 WHERE discordid = ${db.escape(nom.slice(3, -1))} AND isbot = 'FALSE'`
        } else {
            dbrequest = `SELECT * FROM Icon99 WHERE nom LIKE ${db.escape('%' + nom + '%')} AND isbot = 'FALSE'`
        }
        const [results0] = await db.query(dbrequest)
        if (!(results0.length && results0)) return interaction.reply({ content: `Il n'existe aucun personnage du nom de ${nom} !`, ephemeral: true })

        let embed
        if (commande == 'bankaccount') {
            embed = new Discord.MessageEmbed()
                .setTitle(`Solde actuel du compte en banque de ${results0[0].nom}`)
                .addFields({ name: `Nombre de crédits`, value: results0[0].money + ' crédits', inline: true })
                .setThumbnail(results0[0].iconURL)
                .setAuthor({ name: `Demandé par ${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                .setTimestamp()
        } else if (commande == 'addmoney') {
            if (!interaction.member.roles.cache.some(r => config.perms.adminPerms.includes(r.id))) {
                return interaction.reply({ content: `Vous n'avez pas les permissions nécessaires pour effectuer cette action !`, ephemeral: true })
            }
            embed = new Discord.MessageEmbed()
                .setTitle(`Compte en banque de ${results0[0].nom} crédité`)
                .addFields({
                    name: `Nombre de crédits initial`, value: results0[0].money + ' crédits', inline: true
                }, {
                    name: `Nombre de crédits crédités`, value: montant + ' crédits', inline: true
                }, {
                    name: `Nombre de crédits actuel`, value: Number(Number(results0[0].money) + montant) + ' crédits', inline: true
                })
                .setThumbnail(results0[0].iconURL)
                .setAuthor({ name: `Effectué par ${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                .setTimestamp()
            if (nom.startsWith('<@') && nom.endsWith('>')) {
                dbrequest = `UPDATE Icon99 SET money = ${Number(Number(results0[0].money) + montant)} WHERE discordid = ${db.escape(nom.slice(3, -1))} AND isbot = 'FALSE'`
            } else {
                dbrequest = `UPDATE Icon99 SET money = ${Number(Number(results0[0].money) + montant)} WHERE nom LIKE ${db.escape('%' + nom + '%')} AND isbot = 'FALSE'`
            }
            db.query(dbrequest)
        } else if (commande == 'setmoney') {
            if (!interaction.member.roles.cache.some(r => config.perms.adminPerms.includes(r.id))) {
                return interaction.reply({ content: `Vous n'avez pas les permissions nécessaires pour effectuer cette action !`, ephemeral: true })
            }
            embed = new Discord.MessageEmbed()
                .setTitle(`Compte en banque de ${results0[0].nom} mis à jour`)
                .addFields({
                    name: `Nombre de crédits actuel`, value: montant + ' crédits', inline: true
                })
                .setThumbnail(results0[0].iconURL)
                .setAuthor({ name: `Effectué par ${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                .setTimestamp()
            if (nom.startsWith('<@') && nom.endsWith('>')) {
                dbrequest = `UPDATE Icon99 SET money = ${montant} WHERE discordid = ${db.escape(nom.slice(3, -1))} AND isbot = 'FALSE'`
            } else {
                dbrequest = `UPDATE Icon99 SET money = ${montant} WHERE nom LIKE ${db.escape('%' + nom + '%')} AND isbot = 'FALSE'`
            }
            db.query(dbrequest)
        } else if (commande == 'removemoney') {
            if (!interaction.member.roles.cache.some(r => config.perms.adminPerms.includes(r.id))) {
                return interaction.reply({ content: `Vous n'avez pas les permissions nécessaires pour effectuer cette action !`, ephemeral: true })
            }
            embed = new Discord.MessageEmbed()
                .setTitle(`Compte en banque de ${results0[0].nom} débité`)
                .addFields({
                    name: `Nombre de crédits initial`, value: results0[0].money + ' crédits', inline: true
                }, {
                    name: `Nombre de crédits débités`, value: montant + ' crédits', inline: true
                }, {
                    name: `Nombre de crédits actuel`, value: Number(Number(results0[0].money) - montant) + ' crédits', inline: true
                })
                .setThumbnail(results0[0].iconURL)
                .setAuthor({ name: `Effectué par ${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                .setTimestamp()
            if (nom.startsWith('<@') && nom.endsWith('>')) {
                dbrequest = `UPDATE Icon99 SET money = ${Number(Number(results0[0].money) - montant)} WHERE discordid = ${db.escape(nom.slice(3, -1))} AND isbot = 'FALSE'`
            } else {
                dbrequest = `UPDATE Icon99 SET money = ${Number(Number(results0[0].money) - montant)} WHERE nom LIKE ${db.escape('%' + nom + '%')} AND isbot = 'FALSE'`
            }
            db.query(dbrequest)
        }
        interaction.reply({ embeds: [embed] })
    },
}
