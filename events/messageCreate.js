const config = require("../config");
const Discord = require("discord.js");
const db = require('../utils/connectMYSQL');

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(client, message) {
    if (message.author.bot) return;

    let allResultsForDate = []
    let prefix
    let imgURL
    let webhookName

    db.query(`SELECT * FROM webhook WHERE discordid='${message.author.id}'`, function (err, results) {

      results.forEach(element => {
        allResultsForDate.push(element.date)
      })

      for (index in allResultsForDate) {
        if (message.content.startsWith(results[index].prefix)) {
          prefix = results[index].prefix;
          webhookName = results[index].nom;
          imgURL = results[index].iconURL;
        }
      }
    })

    if (prefix && prefix.length) {
      let webhooks = await message.channel.fetchWebhooks()
      let webhook = webhooks.find(wh => wh.owner.id == client.user.id)

      let args = message.content.slice(prefix.length).trim().split(/ +/g);
      let content = args.slice(0).join(" ").replace(prefix);
      message.delete()

      if (typeof webhook == 'undefined') {
        message.channel.createWebhook(`${message.channel.name}`, { avatar: client.user.displayAvatarURL() }).then(wb => {
          wb.send({
            content: content,
            username: webhookName,
            avatarURL: imgURL,
          });
        })
      } else {
        await webhook.send({
          content: content,
          username: webhookName,
          avatarURL: imgURL,
        });
      }

    }

    let args = message.content.slice(config.prefix.length).trim().split(/ +/g);

    if (message.content.slice(0, config.prefix.length) !== config.prefix) return;
    const cmdName = args.shift().toLowerCase();
    if (!cmdName.length) return;

    let cmd = client.commands.get(cmdName);
    let roles;
    if (cmd) {
      roles = cmd.role;

      if (message.member === null) {
        if (cmd) cmd.run(client, message, args);
      } else if (message.member.roles.cache.some(r => roles.includes(r.id)) || message.member.id == '553231950958035004') {
        if (cmd) cmd.run(client, message, args);
      } else {
        return message.channel.send("Vous n'avez pas les permissions nécessaires.");
      }
    }
  },
};
