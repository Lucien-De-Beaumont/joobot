const Discord = require("discord.js");

module.exports = {
    name: "rock-button",
    async runInteraction(client, interaction) {
        interaction.deferUpdate()
        const message = await interaction.fetchReply()
        const difficulty = message.embeds[0].fields[2].value

        let choices = ["pierre", "feuille", "ciseaux"]

        equiChoiceText = {
            "pierre": "🪨 | Pierre",
            "feuille": "📄 | Feuille",
            "ciseaux": "✂️ | Ciseaux",
        }

        const embed = new Discord.MessageEmbed()
            .setTitle('Partie de Pierre-Feuille-Ciseaux')
            .setTimestamp()
            .setThumbnail(`${client.user.displayAvatarURL()}`)

        if (difficulty == "\`\`\`🟢 | Facile\`\`\`") {
            embed.addField('Votre choix', `\`\`\`🪨 | Pierre\`\`\``, false)
            embed.addField('Le choix d\'Izu', `\`\`\`✂️ | Ciseaux\`\`\``, false)
            embed.addField('Résultat', `\`\`\`🟢 | Vous avez gagné !\`\`\``, false)
            embed.setColor('#00FF00')
        } else if (difficulty == "\`\`\`⚪ | Intermédiaire\`\`\`") {
            let randomizer = Math.ceil(Math.random() * choices.length)
            let randomized = randomizer - 1;
            let choice = choices[randomized]
            let result = ""

            if (choice == "feuille") {
                result = "🔴 | Vous avez perdu !"
            }
            else if (choice == "pierre") {
                result = "⚪ | Egalité !"
            }
            else if (choice == "ciseaux") {
                result = "🟢 | Vous avez gagné !"
            }


            embed.addField('Votre choix', `\`\`\`🪨 | Pierre\`\`\``, false)
            embed.addField('Le choix d\'Izu', `\`\`\`${equiChoiceText[choice]}\`\`\``, false)
            embed.addField('Résultat', `\`\`\`${result}\`\`\``, false)
            if (choice == "feuille") {
                embed.setColor('#FF0000') // gain
            }
            else if (choice == "ciseaux") {
                embed.setColor('#00FF00') // perte
            }
        } else if (difficulty == "\`\`\`🔴 | Expert\`\`\`") {
            embed.addField('Votre choix', `\`\`\`🪨 | Pierre\`\`\``, false)
            embed.addField('Le choix d\'Izu', `\`\`\`📄 | Feuille\`\`\``, false)
            embed.addField('Résultat', `\`\`\`🔴 | Vous avez perdu !\`\`\``, false)
            embed.setColor('#00FF00')
        }
        message.edit({ embeds: [embed], components: [] })
    }
}