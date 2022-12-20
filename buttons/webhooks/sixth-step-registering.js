const config = require("../../config");
const Discord = require("discord.js");
const db = require('../../utils/connectMYSQL')

module.exports = {
    name: "sixth-step-registering",
    roles: [config.guild],

    async runInteraction(client, interaction) {

        const modal = new Discord.Modal()
            .setCustomId('sixth-step-modal')
            .setTitle('Bienvenue dans Icon99 !');

        const prefix = new Discord.TextInputComponent()
            .setCustomId('prefix')
            .setLabel("Quel est le préfixe de votre personnage ?")
            .setPlaceholder('ldb!')
            .setRequired(true)
            .setStyle("SHORT");

        const prefixRow = new Discord.MessageActionRow().addComponents(prefix);

        modal.addComponents(prefixRow);

        await interaction.showModal(modal);
    }
}