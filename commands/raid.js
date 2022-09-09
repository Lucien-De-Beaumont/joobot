const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");

module.exports = {
    name: "raid",
    roles: [config.perms['fondateur']],
    description: "Mettre le serveur en mode raid",
    dmPermission: false,
    hidden: false,
    options: [{
        name: "etat",
        description: "Le mode raid doit-il être activé ou désactivé ?",
        required: true,
        type: "STRING",
        choices: [
            { name: 'Activer le mode AntiRaid', value: '🔴' },
            { name: 'Désactiver le mode AntiRaid', value: '🟢' },
        ]
    }
    ],
    helpType: "moderation",

    async runInteraction(client, interaction) {
        let state = interaction.options.getString("etat")
        const msg = await client.channels.cache.get(config.channels['data']).messages.fetch('1017067942548082698')
        if (state == msg.embeds[0].footer.text) {
            interaction.reply({ content: 'Le serveur est déjà dans cet état !', ephemeral: true })
        } else {
            const embed = new Discord.MessageEmbed()
                .setTitle('Etat antiraid')
                .setDescription('Display server raid state')
                .setFooter({ text: state })
                interaction.reply({ content: 'Le serveur a changé d\'état !', ephemeral: true })
            msg.edit({ embeds: [embed] })
        }
    },
}
