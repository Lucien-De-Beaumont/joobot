module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(client, interaction) {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) return interaction.reply("Cette commande n'existe pas !");
      let DMCommands = ['avatar', 'delete', 'info', 'modify', 'register']
      if (DMCommands.indexOf(cmd.name) == -1 && interaction.channel.type == 'DM') { return interaction.reply(`Impossible d'utiliser cette commande ici !`) }
      cmd.runInteraction(client, interaction);
    }
    if (interaction.isButton()) {
      const btn = client.buttons.get(interaction.customId);
      if (!btn) return interaction.reply("Ce bouton n'existe pas!");
      btn.runInteraction(client, interaction);
    }
    if (interaction.isSelectMenu()) {
      const selectMenu = client.selects.get(interaction.customId);
      if (!selectMenu) return interaction.reply("Ce select menu n'existe pas!");
      selectMenu.runInteraction(client, interaction);
    }
  },
};