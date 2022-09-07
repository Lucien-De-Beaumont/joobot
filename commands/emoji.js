const Discord = require("discord.js");
const config = require("../config");
const db = require('../utils/connectMYSQL');

module.exports = {
    name: "emoji",
    description: "Créer / Supprimer un emoji sur le serveur",
    dmPermission: false,
    hidden: false,
    options: [{
        name: "action",
        description: "Que souhaitez-vous faire ?",
        required: true,
        type: "STRING",
        choices: [
            { name: 'Importer un émoji', value: 'create' },
            { name: 'Supprimer un émoji', value: 'delete' },
        ]
    }, {
        name: "emoji",
        description: "Emoji en question",
        required: true,
        type: "STRING",
    }, {
        name: "nom",
        description: "Si création, nom de l'émoji",
        required: false,
        type: "STRING",
    }],
    helpType: "fun",

    async runInteraction(client, interaction) {
        let action = interaction.options.getString("action")
        let nom = interaction.options.getString("nom")
        let emoji = interaction.options.getString("emoji")

        try { eval('config.guild_' + interaction.guild.id + ".perms['adminPerms']") } catch (err) { return Logger.debug('fatal error occured:' + err) }
        if(!interaction.member.roles.cache.some(r => eval('config.guild_' + interaction.guild.id + ".perms['adminPerms']").includes(r.id))){ return interaction.reply({content: `Vous n'avez pas les permissions nécessaires !`, ephemeral: true})}

        if (action == 'create') {
            if (nom === null) { return }
            const createdEmoji = await interaction.guild.emojis.create(`https://cdn.discordapp.com/emojis/${emoji.slice(emoji.lastIndexOf(':') + 1, emoji.length - 1)}`, nom)
            interaction.reply({ content: `Nouvel emoji créé !\n<:${createdEmoji.name}:${createdEmoji.id}> --> \`:${createdEmoji.name}:\``, ephemeral: true })
        } else if (action == 'delete') {
            const toBeDeletedEmoji = await interaction.guild.emojis.fetch(emoji.slice(emoji.lastIndexOf(':') + 1, emoji.length - 1))
            interaction.reply({ content: `Emoji supprimé !\n<:${toBeDeletedEmoji.name}:${toBeDeletedEmoji.id}> --> \`:${toBeDeletedEmoji.name}:\``, ephemeral: true })
            await interaction.guild.emojis.delete(emoji.slice(emoji.lastIndexOf(':') + 1, emoji.length - 1))
        }
    },
}