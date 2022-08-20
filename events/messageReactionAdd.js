const config = require("../config");
const Discord = require("discord.js");
const db = require('../utils/connectMYSQL');

module.exports = {
    name: "messageReactionAdd",
    once: false,
    async execute(client, reaction, user) {
        db.query(`SELECT * FROM webhook WHERE nom=${db.escape(reaction.message.author.username)}`, async function (err, results) {
            if (!results[0]) { return }
            if (reaction.emoji.name == '❌') {
                if (results[0].discordid != user.id) { return }
                reaction.message.delete()
            }
            if (reaction.emoji.name == '📝') {
                let webhooks = await reaction.message.channel.fetchWebhooks()
                let webhook = webhooks.find(wh => wh.owner.id == client.user.id)
                const filter = msg => results[0].discordid == user.id && msg.channel.type == 'DM'
                let content = reaction.message.content
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Edition d'un message`)
                    .setDescription(`Pour éditer ton message, écris simplement en dessous de mon message le nouveau contenu que doit arborer le tien !\n\nExpire <t:${Math.floor(new Date().getTime() / 1000) + 120}:R>.`)
                    .addFields({ name: `Contenu actuel`, value: `\`\`\`${content}\`\`\`` })
                    .setTimestamp()

                reaction.remove()
                user.send({ embeds: [embed] }).then(async msg => {
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
                })
            }
        })
    },
};