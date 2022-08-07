const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(client, member) {
    member.guild
    const embed = new Discord.MessageEmbed()
    .setTitle(`Ho ! Un nouveau membre !`)
    .setImage(`${member.guild.iconURL()}`)
    .setDescription(`Salut !\nBienvenue à toi <@${member.id}>, n’oublie pas de consulter le <#1002176615779926058> et de jeter un œil à tous les salons pour bien comprendre le fonctionnement du serveur !`)
    .setTimestamp()
    .setFooter({text: member.guild.memberCount + " personnes sur le serveur"})

    client.channels.cache.get('1002141497560399912').send({embeds: [embed]})
  },
};