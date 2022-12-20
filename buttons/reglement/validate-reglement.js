const config = require("../../config");
const Discord = require("discord.js");
const Logger = require("../../utils/Logger");

module.exports = {
    name: "validate-reglement",
    roles: [config.guild],

    async runInteraction(client, interaction) {
        interaction.reply({ content: `Vous avez accepté le règlement !\nUtilisez le <#1018126460566913074> pour créer votre avatar !`, ephemeral: true })
        interaction.member.roles.add(config.roles['Sans-fiche'])
        interaction.member.roles.add(config.roles['Categ roles RP'])
    }
}  