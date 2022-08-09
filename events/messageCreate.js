const config = require("../config");
const Discord = require("discord.js");
const db = require('../utils/connectMYSQL');

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(client, message) {
    if (message.author.bot) return;

    const webhooks = await message.guild.fetchWebhooks();
    const webhook = webhooks.find(wh => wh.token)
    await webhook.edit({
      channel: message.channel.id
    });

    db.query(`SELECT * FROM webhook WHERE discordid='${message.author.id}'`, function (err, results) {
      results.forEach(element => {
        if (message.content.startsWith(element.prefix)) {
          let args = message.content.slice(element.prefix.length).trim().split(/ +/g);
          let content = args.slice(0).join(" ").replace(element.prefix);
          message.delete()

          webhook.send({
            content: content,
            username: element.nom,
            avatarURL: element.iconURL,
          });
        }
      })
    })

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
