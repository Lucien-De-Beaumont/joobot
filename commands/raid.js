const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");

module.exports = {
    name: "raid",
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

        try { eval('config.guild_' + interaction.guild.id + ".perms['fondateur']"); eval('config.guild_' + interaction.guild.id + ".channels['data']") } catch (err) { return Logger.debug('fatal error occured:' + err) }
        if (!interaction.member.roles.cache.some(r => eval('config.guild_' + interaction.guild.id + ".perms['fondateur']").includes(r.id))) { return interaction.reply({ content: `Vous n'avez pas les permissions nécessaires !`, ephemeral: true }) }

        const msg = await client.channels.cache.get(eval('config.guild_' + interaction.guild.id + ".channels['data']")).messages.fetch('1017067942548082698')
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
