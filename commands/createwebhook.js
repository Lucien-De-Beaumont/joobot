const Discord = require("discord.js");
const config = require("../config");
const db = require("../utils/connectMYSQL");

module.exports = {
    name: "webhook",
    description: "Commandes test webhook",
    role: [config.moderation['Fondateur'], config.moderation['Administrateur']],
    hidden: false,
    helpType: "fun",
    underConstruction: true,

    run(client, message) {
        message.channel.fetchWebhooks()
            .then(webhooks => console.log(webhooks))
    },

    runInteraction(client, interaction) {
    },
}
