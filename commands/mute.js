const Discord = require("discord.js");
const config = require("../config");

module.exports = {
    name: "mute",
    description: "Réduire au silence un membre",
    role: [config.moderation['Fondateur'], config.moderation['Administrateur'], config.moderation['Modérateur']],
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
            .addField("Membre rendu muet", `<@${member.id}>`, false)
            .addField("Raison", `${muteReason}`, false)
            .setColor('#ff0000')
            .setTimestamp()

        try {
            member.roles.add('874401466104815617')
            interaction.reply({ embeds: [kickEmbed] }) 
        } catch (err) {
            interaction.reply(`Oops!\nIl semblerait que je ne puisse pas rendre muette cette personne..\n\n*Causes probables :* \n\`Cette personne a la permission 'ADMINSTRATEUR'\`.\n\`Cette personne est plus élevée que moi dans la liste des membres\`.`)
        }
},
}
