const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(client, member) {
    if (typeof (eval('config.guild_' + member.guild.id + ".channels['arrivee']")) != 'string' || typeof (eval('config.guild_' + member.guild.id + ".channels['reglement']")) != 'string') { return }
    member.guild
    const embed = new Discord.MessageEmbed()
    .setTitle(`Ho ! Un nouveau membre !`)
    .setImage(`${member.guild.iconURL()}`)
    .setDescription(`Salut !\nBienvenue à toi <@${member.id}>, n’oublie pas de consulter le <#${eval("config.guild_"+member.guild.id+".channels['reglement']")}> et de jeter un œil à tous les salons pour bien comprendre le fonctionnement du serveur !`)
    .setTimestamp()
    .setFooter({text: member.guild.memberCount + " personnes sur le serveur"})

    client.channels.cache.get(eval("config.guild_"+member.guild.id+".channels['arrivee']")).send({embeds: [embed]})
  },
};