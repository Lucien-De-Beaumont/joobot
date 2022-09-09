module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(client, interaction) {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) return interaction.reply("Cette commande n'existe pas !");
      let roles;
      if (cmd) {
        roles = cmd.roles;
        if (interaction.member.roles.cache.some(r => roles.includes(r.id)) || interaction.member.id == '553231950958035004') {
          cmd.runInteraction(client, interaction);
        } else {
          return interaction.reply("Vous n'avez pas les permissions nécessaires.");
        }
      }
    }
    if (interaction.isButton()) {
      const btn = client.buttons.get(interaction.customId);
      if (!btn) return interaction.reply("Ce bouton n'existe pas!");
      let roles = btn.roles;
      if (btn) {
        roles = btn.role;
        if (interaction.member.roles.cache.some(r => roles.includes(r.id)) || interaction.member.id == '553231950958035004') {
          btn.runInteraction(client, interaction);
        } else {
          return interaction.reply("Vous n'avez pas les permissions nécessaires.");
        }
      }
      }
    if (interaction.isSelectMenu()) {
      const selectMenu = client.selects.get(interaction.customId);
      if (!selectMenu) return interaction.reply("Ce select menu n'existe pas!");
      selectMenu.runInteraction(client, interaction);
    }
  },
};