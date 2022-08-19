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

      db.query(`SELECT * FROM webhook WHERE discordid=${db.escape(message.author.id)}`, async function (err, results) {

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
        let webhooks = await message.channel.fetchWebhooks()
        let webhook = webhooks.find(wh => wh.owner.id == client.user.id)

        if (message.content.startsWith(prefix)) {
          if (typeof webhook == 'undefined') {
            let args = message.content.slice(prefix.length).trim().split(/ +/g);
            let content = args.slice(0).join(" ").replace(prefix);
            message.channel.createWebhook(`${message.channel.name}`, { avatar: client.user.displayAvatarURL() }).then(wb => {

              if (message.attachments.map(i => i)[0]) {
                wb.send({
                  files: [...message.attachments.values()],
                  username: webhookName,
                  avatarURL: imgURL,
                })
              } else {
                wb.send({
                  content: content,
                  username: webhookName,
                  avatarURL: imgURL,
                });

              }
            })
          } else {
            let args = message.content.slice(prefix.length).trim().split(/ +/g);
            let content = args.slice(0).join(" ").replace(prefix);

            if (message.attachments.map(i => i)[0]) {
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
          }
          message.delete()
        }

      })
    }
    let args = message.content.slice(config.prefix.length).trim().split(/ +/g);

    if (message.content.slice(0, config.prefix.length) !== config.prefix) return;
    const cmdName = args.shift().toLowerCase();
    if (!cmdName.length) return;

    let cmd = client.commands.get(cmdName);
    if (cmd) {
      cmd.run(client, message, args);
    }
  },
};
