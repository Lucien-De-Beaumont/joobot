const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(client, member) {
    try { eval('config.guild_' + member.guild.id + ".channels['arrivee']"); eval('config.guild_' + member.guild.id + ".channels['reglement']") } catch (err) { return Logger.debug('fatal error occured:' + err) }
    const status = await client.channels.cache.get(eval('config.guild_' + interaction.guild.id + ".channels['data']")).messages.fetch('1017067942548082698')
    if (status.embeds[0].footer.text == '🔴') {
      await member.send('Protection antiraid !\nImpossible de rejoindre ce serveur pour le moment.\nMerci de réessayer dans quelques instants.')
      return member.kick('Protection antiraid !')
    }
    const embed = new Discord.MessageEmbed()
      .setTitle(`Ho ! Un nouveau membre !`)
      .setImage(`${member.guild.iconURL()}`)
      .setDescription(`Salut !\nBienvenue à toi <@${member.id}>, n’oublie pas de consulter le <#${eval("config.guild_" + member.guild.id + ".channels['reglement']")}> et de jeter un œil à tous les salons pour bien comprendre le fonctionnement du serveur !`)
      .setTimestamp()
      .setFooter({ text: member.guild.memberCount + " personnes sur le serveur" })

    member.roles.add(eval("config.guild_" + member.guild.id + ".roles.autoroles['arrivee']"))
    client.channels.cache.get(eval("config.guild_" + member.guild.id + ".channels['arrivee']")).send({ embeds: [embed] })
  },
};