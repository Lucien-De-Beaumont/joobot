const Discord = require("discord.js");
const config = require("../config");
const db = require("../utils/connectMYSQL");

module.exports = {
    name: "tupper",
    description: "Commandes test webhook",
    role: [config.guild],
    hidden: false,
    helpType: "fun",
    underConstruction: true,

    run(client, message) {
        message.channel.createWebhook({
            name: 'Some-username',
            avatar: 'https://i.imgur.com/AfFp7pu.png',
        })
            .then(webhook => console.log(`Created webhook ${webhook}`))
            .catch(console.error);
    },

    runInteraction(client, interaction) {
    },
}
