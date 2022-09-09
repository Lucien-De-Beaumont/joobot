const config = require('../config');
const Logger = require("../utils/Logger");

module.exports = {
    name: "restart",
    roles: [config.perms['mecano']],
    description: "Actualisation des commandes",
    dmPermission: false,
    hidden: true,
    helpType: "dev",

    runInteraction(client, interaction) {
        interaction.reply(`Redémarrage du bot en cours..`)
        setTimeout(() => { process.exit(); }, 200);
    }
}
