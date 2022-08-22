const config = require("../config");
const Discord = require("discord.js");
const db = require('../utils/connectMYSQL');
const Logger = require("../utils/Logger");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(client, message) {
    if (message.author.bot) return;
    if (message.channel.type == 'GUILD_TEXT') {
      let allResultsForDate = []
      let imgURL
      let webhookName
      let prefix

      const [results] = await db.query(`SELECT * FROM webhook WHERE discordid=${db.escape(message.author.id)} ORDER BY CHAR_LENGTH(prefix) DESC`)

      for (element of results) {
        allResultsForDate.push(element.date)
      }

      for (index in allResultsForDate) {
        if (message.content.startsWith(results[index].prefix)) {
          prefix = results[index].prefix;
          webhookName = results[index].nom;
          imgURL = results[index].iconURL;
          break;
        }
      }
      let webhooks = await message.channel.fetchWebhooks()
      let webhook = webhooks.find(wh => wh.owner.id == client.user.id)

      if (message.content.startsWith(prefix)) {
        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let content = args.slice(0).join(" ").replace(/prefix/i);
        if (message.reference !== null) {
          msg = await client.channels.cache.get(message.channel.id).messages.fetch(message.reference.messageId)
          if (!(msg.content.includes('> ') && msg.content.includes('Réponse à') && msg.content.includes('\[Message initial\]\('))) {
            const [results0] = await db.query(`SELECT * FROM webhook WHERE iconURL = '${msg.author.displayAvatarURL()}' OR nom = '${msg.author.username}'`)
            content = '> ' + msg.content.replaceAll('\n', '\n> ') + '\n_Réponse à ' + msg.author.username + ' ( <@' + results0[0].discordid + '> )' + '_ -- [Message initial](' + msg.url + ')\n\n' + content
          }
        }
        if (typeof webhook == 'undefined') {
          webhook = await message.channel.createWebhook(`${message.channel.name}`, { avatar: client.user.displayAvatarURL() })
        }
        if (message.attachments.map(i => i)[0] && content.length) {
          await webhook.send({
            content: content,
            files: [...message.attachments.values()],
            username: webhookName,
            avatarURL: imgURL,
          })
        } else if (message.attachments.map(i => i)[0]) {
          await webhook.send({
            files: [...message.attachments.values()],
            username: webhookName,
            avatarURL: imgURL,
          })
        } else {
          await webhook.send({
            content: content,
            username: webhookName,
            avatarURL: imgURL,
          });
        }
        message.delete()
      }

      // })
    }
  },
};
