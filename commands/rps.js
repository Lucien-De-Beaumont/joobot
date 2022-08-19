const Discord = require("discord.js");
const config = require("../config");

module.exports = {
    name: "rps",
    description: "Pierre, feuille, ciseaux !",
    hidden: false,
    options: [{
        name: "difficulté",
        description: "Avec quelle difficulté voulez-vous jouer?",
        required: true,
        type: "STRING",
        choices: [
            { name: 'Facile', value: 'easy' },
            { name: 'Intermédiaire', value: 'normal' },
            { name: 'Expert', value: 'hard' },
        ]
    }],
    helpType: "fun",

    runInteraction(client, interaction) {
        let difficulty = interaction.options.getString("difficulté")

        equiDifficultyText = {
            "easy": "🟢 | Facile",
            "normal": "⚪ | Intermédiaire",
            "hard": "🔴 | Expert",
        }

        const buttons = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('rock-button')
                    .setLabel('🪨 | Pierre')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('paper-button')
                    .setLabel('📄 | Feuille')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('scissors-button')
                    .setLabel('✂️ | Ciseaux')
                    .setStyle('PRIMARY'),
            )
        const embed = new Discord.MessageEmbed()
            .setTitle('Partie de Pierre-Feuille-Ciseaux')
            .setTimestamp()
            .setThumbnail(`${client.user.displayAvatarURL()}`)
            .addField('Votre choix', '```❓```', false)
            .addField('Le choix d\'Izu', '```❓```', false)
            .addField('Difficulté', `\`\`\`${equiDifficultyText[difficulty]}\`\`\``, false)

        interaction.reply({ embeds: [embed], components: [buttons] })
    },
}
