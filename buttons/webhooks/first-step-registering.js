const config = require("../../config");
const Discord = require("discord.js");
const db = require('../../utils/connectMYSQL')

module.exports = {
    name: "first-step-registering",
    roles: [config.guild],

    async runInteraction(client, interaction) {

        const modal = new Discord.Modal()
            .setCustomId('first-step-modal')
            .setTitle('Bureau d\'enregistrement');

        const name = new Discord.TextInputComponent()
            .setCustomId('name')
            .setLabel("Quel nom de famille porte votre personnage ?")
            .setPlaceholder('Nom de famille, commençant par une majuscule')
            .setRequired(true)
            .setStyle("SHORT")

        const firstName = new Discord.TextInputComponent()
            .setCustomId('firstname')
            .setLabel("Quel est le prénom de votre personnage ?")
            .setPlaceholder('Prénom, commençant par une majuscule')
            .setRequired(true)
            .setStyle("SHORT");

        const age = new Discord.TextInputComponent()
            .setCustomId('age')
            .setLabel("Quel âge a votre personnage ?")
            .setPlaceholder('Âge, sans unité')
            .setRequired(true)
            .setStyle("SHORT");

        const genre = new Discord.TextInputComponent()
            .setCustomId('genre')
            .setLabel("Quel est le genre de votre personnage ?")
            .setPlaceholder('Genre [Homme / Femme] uniquement')
            .setRequired(true)
            .setStyle("SHORT");

        const nameRow = new Discord.MessageActionRow().addComponents(name);
        const firstNameRow = new Discord.MessageActionRow().addComponents(firstName);
        const ageRow = new Discord.MessageActionRow().addComponents(age);
        const genreRow = new Discord.MessageActionRow().addComponents(genre);

        modal.addComponents(firstNameRow, nameRow, ageRow, genreRow);

        await interaction.showModal(modal);
    }
}