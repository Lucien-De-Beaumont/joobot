const Discord = require("discord.js");
const config = require("../config");

module.exports = {
    name: "kick",
    description: "Expulser un membre",
    role: [config.moderation['Fondateur'], config.moderation['Administrateur'], config.moderation['Modérateur']],
    hidden: false,
    options: [{
        name: "membre",
        description: "Qui souhaitez-vous expulser ?",
        required: true,
        type: "USER"
    }, {
        name: "raison",
        description: "Pour quelle raison souhaitez vous l'expulser ?",
        required: true,
        type: "STRING"
    }
    ],
    helpType: "moderation",

    runInteraction(client, interaction) {
        let user = interaction.options.getUser("membre")
        let member = interaction.guild.members.cache.find(member => member.id === user.id)
        let kickreason = interaction.options.getString("raison")

        const kickEmbed = new Discord.MessageEmbed()
            .setTitle("Expulsion d'un membre")
            .setThumbnail(`${client.user.avatarURL()}`)
            .setAuthor({ name: `Expulsé par ${interaction.member.nickname}`, iconURL: `${interaction.member.displayAvatarURL()}` })
            .addField("Membre expulsé", `<@${member.id}>`, false)
            .addField("Raison", `${kickreason}`, false)
            .setColor('#ff0000')
            .setTimestamp()

        if (member.kickable) {
            interaction.reply({ embeds: [kickEmbed] })
            member.kick(kickreason)
        } else {
            interaction.reply(`Oops!\nIl semblerait que je ne puisse pas kick cette personne..\n\n*Causes probables :* \n\`Cette personne a la permission 'ADMINSTRATEUR'\`.\n\`Cette personne est plus élevée que moi dans la liste des membres\`.`)
        }
    },
}
