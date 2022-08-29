// const Discord = require("discord.js");
// const config = require("../config");
// const Logger = require("../utils/Logger");

// module.exports = {
//     name: "raid",
//     description: "Mettre le serveur en mode raid",
//     dmPermission: false,
//     hidden: false,
//     options: [{
//         name: "etat",
//         description: "Le mode raid doit-il être activé ou désactivé ?",
//         required: true,
//         type: "STRING",
//         choices: [
//             { name: 'Activer le mode AntiRaid', value: 'enable' },
//             { name: 'Désactiver le mode AntiRaid', value: 'disable' },
//         ]
//     }
//     ],
//     helpType: "moderation",

//     runInteraction(client, interaction) {
//         let state = interaction.options.getString("etat")

//         try { eval('config.guild_' + interaction.guild.id + ".perms['fondateur']") } catch (err) { return Logger.debug('fatal error occured:' + err) }
//         if (!interaction.member.roles.cache.some(r => eval('config.guild_' + interaction.guild.id + ".perms['fondateur']").includes(r.id))) { return interaction.reply({ content: `Vous n'avez pas les permissions nécessaires !`, ephemeral: true }) }


//     },
// }
