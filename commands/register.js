const Discord = require("discord.js");
const config = require("../config");
const db = require("../utils/connectMYSQL");

module.exports = {
    name: "register",
    description: "Créer un nouveau personnage RP",
    role: [config.guild],
    hidden: false,
    helpType: "fun",
    underConstruction: false,
    options: [{
        name: "nom",
        description: "Quel sera le nom de votre personnage RP ?",
        required: true,
        type: "STRING"
    }, {
        name: "prefixe",
        description: "Par quelle portion de texte devra commencer votre message pour que votre personnage parle ?",
        required: true,
        type: "STRING"
    }, {
        name: "avatar",
        description: "Quel sera le lien de l'avatar de votre personnage ?",
        required: true,
        type: "STRING"
    }
    ],

    async runInteraction(client, interaction) {
        let nom = interaction.options.getString('nom')
        let prefix = interaction.options.getString('prefixe')
        let avatarURL = interaction.options.getString('avatar')

        function isImage(url) {
            return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
        }

        if (!isImage(avatarURL)) { return interaction.reply({ content: `Oops! Ce lien ne semble pas rediriger vers une image  ( formats autorisés : \`jpg|jpeg|png|webp|avif|gif|svg\` ) !`, ephemeral: true }) }
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('validate-character-button')
                    .setLabel('✅ | Créer mon personnage')
                    .setStyle('SUCCESS'),
                new Discord.MessageButton()
                    .setCustomId('refuse-character-button')
                    .setLabel('❌ | Revenir en arrière')
                    .setStyle('DANGER'),
            )
        const embed = new Discord.MessageEmbed()
            .setTitle(`Validation de création d'un nouveau personnage`)
            .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
            .setThumbnail(`${avatarURL}`)
            .setDescription(`Merci de vérifier les informations fournies, les seules modifications possibles se restreignent à changer l'avatar de votre personnage.\nSi l'avatar n'apparaît pas dans le message, merci de considérer que celui n'est pas valide.\nEn conséquent, toute autre information est figée définitivement ( quoique modifiable par le <@&${config.dev['Mécano']}>, <@553231950958035004> ).`)
            .addFields({
                name: `Nom du personnage`, value: `${nom}`, inline: true
            }, {
                name: `Préfixe`, value: `${prefix}`, inline: true
            }, {
                name: `Lien de l'avatar`, value: `${avatarURL}`, inline: true
            }, {
                name: `Exemple type d'utilisation`, value: `\`\`\`${prefix} Bonjour ! Je suis ${nom} !\`\`\``, inline: false
            }, {
                name: `Retour du message`, value: `\`\`\`Bonjour ! Je suis ${nom} !\`\`\``, inline: false
            })
            .setTimestamp()

        interaction.reply({ embeds: [embed], components: [button] })
    },
}
