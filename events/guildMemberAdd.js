const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(client, member) {
    const status = await client.channels.cache.get(config.channels['data']).messages.fetch('1017067942548082698')
    if (status.embeds[0].footer.text == '🔴') {
      await member.send('Protection antiraid !\nImpossible de rejoindre ce serveur pour le moment.\nMerci de réessayer dans quelques instants.')
      return member.kick('Protection antiraid !')
    }
    const embed = new Discord.MessageEmbed()
      .setTitle(`Ho ! Un nouveau membre !`)
      .setImage(`${member.guild.iconURL()}`)
      .setDescription(`Salut !\nBienvenue à toi <@${member.id}>, n’oublie pas de consulter le <#${config.channels['reglement']}> et de jeter un œil à tous les salons pour bien comprendre le fonctionnement du serveur !`)
      .setTimestamp()
      .setFooter({ text: member.guild.memberCount + " personnes sur le serveur" })

    member.roles.add(config.roles.autoroles['arrivee'])
    client.channels.cache.get(config.channels['arrivee']).send({ embeds: [embed] })
  },
};