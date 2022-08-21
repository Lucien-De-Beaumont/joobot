const config = require("../config");
const Discord = require("discord.js");
const db = require('../utils/connectMYSQL');

module.exports = {
    name: "messageReactionAdd",
    once: false,
    async execute(client, reaction, user) {
        const [results] = await db.query(`SELECT * FROM webhook WHERE nom=${db.escape(reaction.message.author.username)}`)
        if (!results[0]) { return }
        if (reaction.emoji.name == '❌') {
            if (results[0].discordid != user.id) { return }
            reaction.message.delete()
        }
        if (reaction.emoji.name == '📝') {
            let webhooks = await reaction.message.channel.fetchWebhooks()
            let webhook = webhooks.find(wh => wh.owner.id == client.user.id)
            reaction.remove()
            if (results[0].discordid != user.id) { return }
            const filter = msg => msg.channel.type == 'DM'
            let content = reaction.message.content
            const embed = new Discord.MessageEmbed()
                .setTitle(`Edition d'un message`)
                .setDescription(`Pour éditer ton message, écris simplement en dessous de mon message le nouveau contenu que doit arborer le tien !\n\nExpire <t:${Math.floor(new Date().getTime() / 1000) + 120}:R>.`)
                .addFields({ name: `Contenu actuel`, value: `\`\`\`${content}\`\`\`` })
                .setTimestamp()
            const msg = await user.send({ embeds: [embed] })
            const collector = msg.channel.createMessageCollector({ filter, time: 120000 })
            collector.on('collect', async collected => {
                content = collected.content
                collector.stop()
                await webhook.editMessage(reaction.message.id, {
                    content: content,
                });

                const embed2 = new Discord.MessageEmbed()
                    .setTitle(`Message édité !`)
                    .addFields(
                        { name: `Ancien contenu`, value: embed.fields[0].value },
                        { name: `Nouveau contenu`, value: `\`\`\`${content}\`\`\`` },
                    )
                    .setTimestamp()
                msg.edit({ embeds: [embed2] })
            })
        }
        if (reaction.emoji.name == '❓') {
            reaction.remove()
            const [results0] = await db.query(`SELECT * FROM webhook WHERE discordid=${db.escape(user.id)} AND nom=${db.escape(reaction.message.author.username)}`)
            if (!(results0 && results0.length)) { return }
            const infoEmbed = new Discord.MessageEmbed()
                .setTitle("Informations sur un message")
                .addFields({ name: "Nom du personnage", value: `${results0[0].nom}`, inline: false },
                    { name: "Propriétaire", value: `<@${results0[0].discordid}>`, inline: false },
                    { name: `Préfixe`, value: results0[0].prefix, inline: false },
                    { name: "Date de création", value: `<t:${Math.floor(new Date(results0[0].date).getTime() / 1000)}:R>, le <t:${Math.floor(new Date(results0[0].date).getTime() / 1000)}:f>`, inline: false })
                .setColor('#FFFF00')
                .setTimestamp()

            user.send({ embeds: [infoEmbed] })
        }
    },
};