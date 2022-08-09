const config = require("../config");
const Discord = require("discord.js");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(client, message) {
    if (message.author.bot) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);

    let prefix = 'llm!'
    if (message.content.startsWith(prefix)) {
      // let avatarURL = args[2]
      // let username = args[3]

      let content = args.slice(0).join(" ").replace(prefix);

      const webhooks = await message.guild.fetchWebhooks();
      const webhook = webhooks.find(wh => wh.token);

      await webhook.edit({
        channel: message.channel.id
      });

      message.delete()

      webhook.send({
        content: content,
        username: 'Lucien le mécano',
        avatarURL: 'https://fr.web.img5.acsta.net/c_310_420/medias/nmedia/18/69/18/59/18865095.jpg',
      });

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
