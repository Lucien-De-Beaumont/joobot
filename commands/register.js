const Discord = require("discord.js");
const config = require("../config");
const db = require("../utils/connectMYSQL");

module.exports = {
    name: "register",
    roles: [config.guild],
    description: "Créer un nouveau personnage RP",
    dmPermission: true,
    hidden: false,
    helpType: "fun",
    both: true,
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
    }],

    async runInteraction(client, interaction) {
        let nom = interaction.options.getString('nom')
        let prefix = interaction.options.getString('prefixe')

        const [results] = await db.query(`SELECT * FROM webhook WHERE discordid='${interaction.user.id}' AND (prefix=${db.escape(prefix)} OR nom = ${db.escape(nom)})`)

        if (results && results.length) {
            if (results[0].prefix == prefix) {
                return interaction.reply({ content: `Vous avez déjà un personnage enregistré avec ce préfixe : \`${prefix}\`` })
            } else if (results[0].nom == nom) {
                return interaction.reply({ content: `Vous avez déjà un personnage enregistré avec ce nom : \`${nom}\`` })
            } else if (results[0].prefix == prefix && results[0].nom == nom) {
                return interaction.reply({ content: `Vous avez déjà un personnage enregistré avec ce préfixe et ce nom : \`${prefix}\` -- \`${nom}\`` })
            }
        } else {
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
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`Merci de vérifier les informations fournies, les seules modifications possibles se restreignent à changer l'avatar de votre personnage.\nSi l'avatar n'apparaît pas dans le message, merci de considérer que celui n'est pas valide.\nEn conséquent, toute autre information est figée définitivement ( quoique modifiable par le mécano, <@553231950958035004> ).`)
                .addFields({
                    name: `Nom du personnage`, value: `${nom}`, inline: true
                }, {
                    name: `Préfixe`, value: `${prefix}`, inline: true
                }, {
                    name: `Votre discord ID`, value: `${interaction.user.id}`, inline: true
                }, {
                    name: `Exemple type d'utilisation`, value: `\`\`\`${prefix} Bonjour ! Je suis ${nom} !\`\`\``, inline: false
                }, {
                    name: `Retour du message`, value: `\`\`\`Bonjour ! Je suis ${nom} !\`\`\``, inline: false
                })
                .setTimestamp()

            interaction.reply({ embeds: [embed], components: [button] })
        }
    },
}
