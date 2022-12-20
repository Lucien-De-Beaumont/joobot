const config = require("../../config");
const Discord = require("discord.js");
const db = require('../../utils/connectMYSQL')

module.exports = {
    name: "third-step-registering",
    roles: [config.guild],

    async runInteraction(client, interaction) {

        const modal = new Discord.Modal()
            .setCustomId('third-step-modal')
            .setTitle('Bureau de psychologie');

        const mental = new Discord.TextInputComponent()
            .setCustomId('mental')
            .setLabel("Décrivez le caractère de votre personnage.")
            .setPlaceholder('Laissez libre cours à votre imagination, à la 3ème personne')
            .setRequired(true)
            .setStyle("PARAGRAPH");

        const gouts = new Discord.TextInputComponent()
            .setCustomId('gouts')
            .setLabel("Décrivez les goûts de votre personnage.")
            .setPlaceholder('Laissez libre cours à votre imagination, à la 3ème personne')
            .setRequired(true)
            .setStyle("PARAGRAPH");

        const history = new Discord.TextInputComponent()
            .setCustomId('history')
            .setLabel("Détaillez l'histoire de votre personnage.")
            .setPlaceholder('Laissez libre cours à votre imagination, à la 3ème personne')
            .setRequired(true)
            .setStyle("PARAGRAPH");

        const mentalRow = new Discord.MessageActionRow().addComponents(mental);
        const goutsRow = new Discord.MessageActionRow().addComponents(gouts);
        const historyRow = new Discord.MessageActionRow().addComponents(history);

        modal.addComponents(mentalRow, goutsRow, historyRow);

        await interaction.showModal(modal);
    }
}