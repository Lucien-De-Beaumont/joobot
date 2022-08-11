const config = require("../config");
const Discord = require("discord.js");
const db = require('../utils/connectMYSQL');

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(client, message) {
    if (message.author.bot) return;

    let allResultsForURL = []
    let correctURL
    let prefix
    let imgURL
    let webhookName
    let tester

    db.query(`SELECT * FROM webhook WHERE discordid='${message.author.id}'`, function (err, results) {

      results.forEach(element => {
        allResultsForURL.push(element.webhookURL)
      })

      for (index in allResultsForURL) {
        if (message.content.startsWith(results[index].prefix)) {
          prefix = results[index].prefix;
          webhookName = results[index].name;
          imgURL = results[index].iconURL;
          correctURL = results[index].webhookURL
        }
      }
    })
    try {
      const webhooks = await message.guild.fetchWebhooks()
      const webhook = webhooks.find(wh => wh.token == `${correctURL.slice(correctURL.lastIndexOf('/') + 1, correctURL.length)}`)

      await webhook.edit({
        channel: message.channel.id,
        name: webhookName
      });

      let args = message.content.slice(prefix.length).trim().split(/ +/g);
      let content = args.slice(0).join(" ").replace(prefix);
      message.delete()
      await webhook.send({
        content: content,
        username: webhookName,
        avatarURL: imgURL,
      });
    } catch (err) {

    }

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
