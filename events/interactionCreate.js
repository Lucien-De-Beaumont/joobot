const db = require("../utils/connectMYSQL");
const date = require('date-and-time');
const config = require('../config');

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
        roles = btn.roles;
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

    if (interaction.isModalSubmit()) {
      const [results] = await db.query(`SELECT * FROM Icon99 WHERE discordid = '${interaction.member.id}' AND isbot = 'FALSE'`)
      if (!(results && results.length)) {
        await db.query(`INSERT INTO Icon99 (nom, age, genre, taille, poids, physique, mental, gouts, histoire, money, role, prefix, isbot, iconURL, discordid, date) VALUES ('', '', '', '', '', '', '', '', '', '', '', '150', '', 'https://cdn.discordapp.com/icons/1017860185454297088/88e4c406d4d2e9736be3f33afca81df1.webp', '${interaction.member.id}', '${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}')`)
      }
      if (interaction.customId == 'first-step-modal') {
        let nom = (interaction.fields.getTextInputValue('firstname') + ' ' + interaction.fields.getTextInputValue('name'))
        let age = interaction.fields.getTextInputValue('age')
        let genre = interaction.fields.getTextInputValue('genre')

        if (isNaN(age)) { return interaction.reply({ content: `Merci de saisir une valeur correcte pour l'âge !\nValeur correcte : \`15\`\nValeur incorrecte : \`quinze\`, \`15 ans\`...`, ephemeral: true }) }
        if (genre != 'Homme' && genre != 'Femme') { return interaction.reply({ content: `Merci de saisir une valeur correcte pour le genre !\nValeur correcte : \`Homme\`, \`Femme\`\nValeur incorrecte : \`homme\`, \`femme\`, \`garçon\`...`, ephemeral: true }) }
        await db.query(`UPDATE Icon99 SET nom = ${db.escape(nom)}, age = ${db.escape(age)}, genre=${db.escape(genre)} WHERE discordid = '${interaction.member.id}' AND isbot = 'FALSE'`)
        interaction.reply({ content: `Les informations de ${nom} ont bien été enregistrées !`, ephemeral: true })
        interaction.member.roles.remove(config.roles.creation['inscription'])
        interaction.member.roles.add(config.roles.creation['medic'])
      } else if (interaction.customId == 'second-step-modal') {
        let height = interaction.fields.getTextInputValue('height')
        let weight = interaction.fields.getTextInputValue('weight')
        let physic = interaction.fields.getTextInputValue('physic')

        if (isNaN(height)) { return interaction.reply({ content: `Merci de saisir une valeur correcte en centimètres pour la taille !\nValeur correcte : \`157\`\nValeur incorrecte : \`1m57\`, \`157cm\`...`, ephemeral: true }) }
        if (isNaN(weight)) { return interaction.reply({ content: `Merci de saisir une valeur correcte pour le poids !\nValeur correcte : \`62\`\nValeur incorrecte : \`62kg\`, \`62 kilos\`...`, ephemeral: true }) }
        await db.query(`UPDATE Icon99 SET taille = ${db.escape(height)}, poids = ${db.escape(weight)}, physique=${db.escape(physic)} WHERE discordid = '${interaction.member.id}' AND isbot = 'FALSE'`)
        interaction.reply({ content: `Les informations ont bien été enregistrées !`, ephemeral: true })
        interaction.member.roles.remove(config.roles.creation['medic'])
        interaction.member.roles.add(config.roles.creation['psycho'])
      } else if (interaction.customId == 'third-step-modal') {
        let mental = interaction.fields.getTextInputValue('mental')
        let gouts = interaction.fields.getTextInputValue('gouts')
        let history = interaction.fields.getTextInputValue('history')
        await db.query(`UPDATE Icon99 SET mental = ${db.escape(mental)}, gouts = ${db.escape(gouts)}, histoire=${db.escape(history)} WHERE discordid = '${interaction.member.id}' AND isbot = 'FALSE'`)
        interaction.reply({ content: `Les informations ont bien été enregistrées !`, ephemeral: true })
        interaction.member.roles.remove(config.roles.creation['psycho'])
        interaction.member.roles.add(config.roles.creation['photo'])
      } else if (interaction.customId == 'sixth-step-modal') {
        let prefix = interaction.fields.getTextInputValue('prefix')
        await db.query(`UPDATE Icon99 SET prefix = ${db.escape(prefix)} WHERE discordid = '${interaction.member.id}' AND isbot = 'FALSE'`)
        interaction.reply({ content: `Les informations ont bien été enregistrées !`, ephemeral: true })
        interaction.member.roles.remove(config.roles.creation['welcome'])
        interaction.member.roles.remove(config.roles['Sans-fiche'])
        interaction.member.roles.add(config.roles['Categ roles RP'])
        interaction.member.roles.add(config.roles['RolePlayer'])
        interaction.member.roles.add(config.roles['Membre'])
      }
    }
  },
};