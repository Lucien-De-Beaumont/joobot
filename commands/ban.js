const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");

module.exports = {
    name: "ban",
    roles: [config.perms['wholeStaff']],
    description: "Bannir un membre",
    dmPermission: false,
    hidden: false,
    options: [{
        name: "membre",
        description: "Qui souhaitez-vous bannir ?",
        required: true,
        type: "USER"
    }, {
        name: "raison",
        description: "Pour quelle raison souhaitez vous le bannir ?",
        required: true,
        type: "STRING"
    }, {
        name: "jours",
        description: "Sur quel nombre de jours dois-je supprimer les messages de cette personne ?",
        required: true,
        type: "NUMBER",
    }
    ],
    helpType: "moderation",

    runInteraction(client, interaction) {
        let user = interaction.options.getUser("membre")
        let member = interaction.guild.members.cache.find(member => member.id === user.id)
        let dayDeleteMessages = interaction.options.getNumber("jours")
        let banreason = interaction.options.getString("raison")

        if (dayDeleteMessages < 0 || dayDeleteMessages > 7) {
            interaction.reply(`Oops!\nIl semblerait que je ne puisse pas bannir cette personne..\n\n*Causes probables :* \n\`Je ne peux pas supprimer les messages envoyés les ${dayDeleteMessages} derniers jours par cette personne ( ce chiffre doit être compris entre 0 et 7 )\`.`)
        }
        const banEmbed = new Discord.MessageEmbed()
            .setTitle("Bannissement d'un membre")
            .setThumbnail(`${client.user.avatarURL()}`)
            .setAuthor({ name: `Banni par ${interaction.member.displayName}`, iconURL: `${interaction.member.displayAvatarURL()}` })
            .addFields({ name: "Membre banni", value: `<@${member.id}>`, inline: false })
            .addFields({ name: "Raison", value: `${banreason}`, inline: false })
            .setColor('#ff0000')
            .setTimestamp()

        if (member.bannable) {
            interaction.reply({ embeds: [banEmbed] })
            member.ban({ days: dayDeleteMessages, reason: banreason })
        } else {
            interaction.reply(`Oops!\nIl semblerait que je ne puisse pas bannir cette personne..\n\n*Causes probables :* \n\`Cette personne a la permission 'ADMINSTRATEUR'\`.\n\`Cette personne est plus élevée que moi dans la liste des membres\`.`)
        }
    },
}
