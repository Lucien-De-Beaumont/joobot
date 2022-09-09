const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");

module.exports = {
    name: "mute",
    roles: [config.perms['wholeStaff']],
    description: "Réduire au silence un membre",
    dmPermission: false,
    hidden: false,
    options: [{
        name: "membre",
        description: "Qui souhaitez-vous réduire au silence ?",
        required: true,
        type: "USER"
    }, {
        name: "raison",
        description: "Pour quelle raison souhaitez vous le réduire au silence ?",
        required: true,
        type: "STRING"
    }
    ],
    helpType: "moderation",

    runInteraction(client, interaction) {
        let user = interaction.options.getUser("membre")
        let member = interaction.guild.members.cache.find(member => member.id === user.id)
        let muteReason = interaction.options.getString("raison")

        const muteEmbed = new Discord.MessageEmbed()
            .setTitle("Réduction au silence d'un membre")
            .setThumbnail(`${client.user.avatarURL()}`)
            .setAuthor({ name: `Rendu muet par ${interaction.member.displayName}`, iconURL: `${interaction.member.displayAvatarURL()}` })
            .addFields({ name: "Membre rendu muet", value: `<@${member.id}>`, inline: false })
            .addFields({ name: "Raison", value: `${muteReason}`, inline: false })
            .setColor('#ff0000')
            .setTimestamp()

        try {
            member.roles.add(config.roles['Mute'])
            interaction.reply({ embeds: [muteEmbed] })
        } catch (err) {
            interaction.reply(`Oops!\nIl semblerait que je ne puisse pas rendre muette cette personne..\n\n*Causes probables :* \n\`Cette personne a la permission 'ADMINSTRATEUR'\`.\n\`Cette personne est plus élevée que moi dans la liste des membres\`.`)
        }
    },
}
