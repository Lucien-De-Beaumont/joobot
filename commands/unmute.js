const Discord = require("discord.js");
const config = require("../config");

module.exports = {
    name: "unmute",
    description: "Rendre la parole à un membre",
    role: [config.moderation['Fondateur'], config.moderation['Administrateur'], config.moderation['Modérateur']],
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
            .addField("Membre à qui la parole a été rendue", `<@${member.id}>`, false)
            .setColor('#ff0000')
            .setTimestamp()
        if (unmuteReason !== null) {
            unmuteEmbed.addField("Raison", `${unmuteReason}`, false)
        }

        try {
            member.roles.remove(config.roles['Mute'])
            interaction.reply({ embeds: [unmuteEmbed] })
        } catch (err) {
            interaction.reply(`Oops!\nIl semblerait que je ne puisse pas rendre la parole à cette personne..\n\n*Causes probables :* \n\`Cette personne a la permission 'ADMINSTRATEUR'\`.\n\`Cette personne est plus élevée que moi dans la liste des membres\`.`)
        }
    },
}
