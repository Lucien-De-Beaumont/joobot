const Discord = require("discord.js");
const config = require("../config");

module.exports = {
    name: "rps",
    description: "Pierre, feuille, ciseaux !",
    dmPermission: false,
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
            .addFields(
                { name: 'Votre choix', value: '```❓```', inline: false },
                { name: 'Le choix d\'Izu', value: '```❓```', inline: false },
                { name: 'Difficulté', value: '\`\`\`${equiDifficultyText[difficulty]}\`\`\`', inline: false }
            )

        interaction.reply({ embeds: [embed], components: [buttons] })
    },
}
