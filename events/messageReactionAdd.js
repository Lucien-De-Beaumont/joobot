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
        })
    },
};