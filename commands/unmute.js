const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");

module.exports = {
    name: "unmute",
    roles: [config.perms['wholeStaff']],
    description: "Rendre la parole à un membre",
    dmPermission: false,
    hidden: false,
    options: [{
        name: "membre",
        description: "A qui souhaitez-vous rendre la parole ?",
        required: true,
        type: "USER"
    }, {
        name: "raison",
        description: "Pour quelle raison souhaitez vous lui rendre la parole ?",
        required: false,
        type: "STRING"
    }
    ],
    helpType: "moderation",

    runInteraction(client, interaction) {
        let user = interaction.options.getUser("membre")
        let member = interaction.guild.members.cache.find(member => member.id === user.id)
        let unmuteReason = interaction.options.getString("raison")
        const unmuteEmbed = new Discord.MessageEmbed()
            .setTitle("Don de la parole à un membre")
            .setThumbnail(`${client.user.avatarURL()}`)
            .setAuthor({ name: `Parole rendue par ${interaction.member.displayName}`, iconURL: `${interaction.member.displayAvatarURL()}` })
            .addFields({ name: "Membre à qui la parole a été rendue", value: `<@${member.id}>`, inline: false })
            .setColor('#ff0000')
            .setTimestamp()
        if (unmuteReason !== null) {
            unmuteEmbed.addFields({ name: "Raison", value: `${unmuteReason}`, inline: false })
        }

        try {
            member.roles.remove(config.roles['Mute'])
            interaction.reply({ embeds: [unmuteEmbed] })
        } catch (err) {
            interaction.reply(`Oops!\nIl semblerait que je ne puisse pas rendre la parole à cette personne..\n\n*Causes probables :* \n\`Cette personne a la permission 'ADMINSTRATEUR'\`.\n\`Cette personne est plus élevée que moi dans la liste des membres\`.`)
        }
    },
}
