const Discord = require("discord.js");
const config = require("../config");
const db = require("../utils/connectMYSQL");

module.exports = {
    name: "register",
    description: "Créer un nouveau personnage RP",
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


        db.query(`SELECT * FROM webhook WHERE discordid='${interaction.member.id}' AND prefix='${prefix}'`, function (err, results) {
            if (!(results && results.length)) {

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
                    .setDescription(`Merci de vérifier les informations fournies, les seules modifications possibles se restreignent à changer l'avatar de votre personnage.\nSi l'avatar n'apparaît pas dans le message, merci de considérer que celui n'est pas valide.\nEn conséquent, toute autre information est figée définitivement ( quoique modifiable par le <@&${eval('config.guild_' + interaction.guild.id + ".dev['Mécano']")}>, <@553231950958035004> ).`)
                    .addFields({
                        name: `Nom du personnage`, value: `${nom}`, inline: true
                    }, {
                        name: `Préfixe`, value: `${prefix}`, inline: true
                    }, {
                        name: `Votre discord ID`, value: `${interaction.member.id}`, inline: true
                    }, {
                        name: `Exemple type d'utilisation`, value: `\`\`\`${prefix} Bonjour ! Je suis ${nom} !\`\`\``, inline: false
                    }, {
                        name: `Retour du message`, value: `\`\`\`Bonjour ! Je suis ${nom} !\`\`\``, inline: false
                    })
                    .setTimestamp()

                interaction.reply({ embeds: [embed], components: [button] })
            } else {
                interaction.reply({ content: `Vous avez déjà un personnage enregistré avec le préfixe \`${prefix}\` !` })
            }
        })
    },
    async run(client, message) {
        if (message.channel.type != 'DM') {
            return message.reply('Cette commande ne peut être effectuée qu\'en MP avec IzuBot !')
        }
        let nom
        let prefix
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

        const embed0 = new Discord.MessageEmbed()
            .setTitle(`Création d'un nouveau personnage`)
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setDescription(`Merci de fournir le nom de votre personnage ( caractères spéciaux autorisés ).\nExpire <t:${Math.floor(new Date().getTime() / 1000) + 60}:R>.`)
        const filter = msg => msg.channel.type == 'DM' && msg.author.id == message.author.id
        message.author.send({ embeds: [embed0] }).then(async msg => {
            const collector = msg.channel.createMessageCollector({ filter, time: 60000 })
            collector.on('collect', async collected => {
                nom = collected.content
                collector.stop()

                const embed1 = new Discord.MessageEmbed()
                    .setTitle(`Création d'un nouveau personnage`)
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                    .setDescription(`Merci de fournir le préfixe de votre personnage.\nExpire <t:${Math.floor(new Date().getTime() / 1000) + 60}:R>.`)

                message.author.send({ embeds: [embed1] })
                const collector2 = await msg.channel.createMessageCollector({ filter, time: 60000 })
                collector2.on('collect', async collected2 => {
                    prefix = collected2.content
                    collector2.stop()

                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Validation de création d'un nouveau personnage`)
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription(`Merci de vérifier les informations fournies, les seules modifications possibles se restreignent à changer l'avatar de votre personnage.\nSi l'avatar n'apparaît pas dans le message, merci de considérer que celui n'est pas valide.\nEn conséquent, toute autre information est figée définitivement ( quoique modifiable par le Mécano, <@553231950958035004> ).`)
                        .addFields({
                            name: `Nom du personnage`, value: `${nom}`, inline: true
                        }, {
                            name: `Préfixe`, value: `${prefix}`, inline: true
                        }, {
                            name: `Votre discord ID`, value: `${message.author.id}`, inline: true
                        }, {
                            name: `Exemple type d'utilisation`, value: `\`\`\`${prefix} Bonjour ! Je suis ${nom} !\`\`\``, inline: false
                        }, {
                            name: `Retour du message`, value: `\`\`\`Bonjour ! Je suis ${nom} !\`\`\``, inline: false
                        })
                        .setTimestamp()

                    collected.channel.send({ embeds: [embed], components: [button] })
                })
            })
        })
    }
}
