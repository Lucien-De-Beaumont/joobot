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
            // if (reaction.emoji.name == '📝') {
            //     const filter = msg => results[0].discordid == user.id && msg.channel.type == 'DM'
            //     const collector = reaction.message.channel.createMessageCollector({ filter, time: 120000 })
            //     let webhooks = await reaction.message.channel.fetchWebhooks()
            //     let webhook = webhooks.find(wh => wh.owner.id == client.user.id)
            //     let content = reaction.message.content
            //     user.send(`Texte actuel : \n\n${content}`)

            //     collector.on('collect', async collected => {
            //         content = collected.content
            //         collected.delete()
            //         collector.stop()

            //         await webhook.editMessage(reaction.message.id, {
            //             content: content,
            //         });

            //     })
            // }
        })
    },
};