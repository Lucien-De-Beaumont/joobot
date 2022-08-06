const config = require('../config');

module.exports = {
    name: "restart",
    description: "Actualisation des commandes",
    role: [config.dev['Mécano']],
    hidden: true,
    helpType: "dev",

    runInteraction(client, interaction) {
        interaction.reply(`Redémarrage du bot en cours..`)
        setTimeout(() => { process.exit(); }, 200);
    }
}
