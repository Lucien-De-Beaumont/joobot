const config = require('../config');

module.exports = {
    name: "restart",
    description: "Actualisation des commandes",
    hidden: true,
    helpType: "dev",

    runInteraction(client, interaction) {
        if(!interaction.member.roles.cache.some(r => eval('config.guild_'+interaction.guild.id+".perms['mecano']").includes(r.id))){ return interaction.reply({content: `Vous n'avez pas les permissions nécessaires !`, ephemeral: true})}
        interaction.reply(`Redémarrage du bot en cours..`)
        setTimeout(() => { process.exit(); }, 200);
    }
}
