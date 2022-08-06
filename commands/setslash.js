const config = require('../config');

module.exports = {
    name: "setslash",
    description: "Actualisation des commandes",
    role: [config.dev['Mécano']],
    hidden: true,
    options: [{
        name: "code",
        description: "Code de validation",
        required: true,
        type: "INTEGER"
    }
    ],
    helpType: "dev",

    runInteraction(client, interaction) {

        const now = new Date()
        const hours = now.getHours()
        const mins = now.getMinutes()

        let validationCode = interaction.options.getInteger("code")

        if (Math.abs(validationCode - (hours * mins)) <= hours) {
            const guild = client.guilds.cache.get("831199788728844348");
            guild.commands.set(client.slashCommands.map(cmd => cmd));

            interaction.reply(`Actualisation de toutes les commandes..\nLe bot va redémarrer.`)
            setTimeout(() => { process.exit(); }, 200);
        } else {
            interaction.reply(`Code de redémarrage invalide !`)
        }
    }
}
