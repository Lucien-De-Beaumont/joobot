const config = require("../../config");
const Discord = require("discord.js");
const db = require('../../utils/connectMYSQL')

module.exports = {
    name: "second-step-registering",
    roles: [config.guild],

    async runInteraction(client, interaction) {

        const modal = new Discord.Modal()
            .setCustomId('second-step-modal')
            .setTitle('Bureau médical');

        const height = new Discord.TextInputComponent()
            .setCustomId('height')
            .setLabel("Quel est la taille de votre personnage ?")
            .setPlaceholder('Taille en centimètres, nombre entier, sans unité')
            .setRequired(true)
            .setStyle("SHORT");

        const weight = new Discord.TextInputComponent()
            .setCustomId('weight')
            .setLabel("Quel est le poids de votre personnage ?")
            .setPlaceholder('Poids en kilos, nombre entier, sans unité')
            .setRequired(true)
            .setStyle("SHORT");

        const physic = new Discord.TextInputComponent()
            .setCustomId('physic')
            .setLabel("Décrivez physiquement votre personnage.")
            .setPlaceholder('Laissez libre cours à votre imagination, à la 3ème personne')
            .setRequired(true)
            .setStyle("PARAGRAPH");

        const heightRow = new Discord.MessageActionRow().addComponents(height);
        const weightRow = new Discord.MessageActionRow().addComponents(weight);
        const physicRow = new Discord.MessageActionRow().addComponents(physic);

        modal.addComponents(heightRow, weightRow, physicRow);

        await interaction.showModal(modal);
    }
}