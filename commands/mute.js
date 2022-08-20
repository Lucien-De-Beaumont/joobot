const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");

module.exports = {
    name: "mute",
    description: "Réduire au silence un membre",
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

        try { eval('config.guild_' + interaction.guild.id + ".perms['wholeStaff']") } catch (err) { return Logger.debug('fatal error occured:' + err)}
        if(!interaction.member.roles.cache.some(r => eval('config.guild_'+interaction.guild.id+".perms['wholeStaff']").includes(r.id))){ return interaction.reply({content: `Vous n'avez pas les permissions nécessaires !`, ephemeral: true})}
        
        const muteEmbed = new Discord.MessageEmbed()
            .setTitle("Réduction au silence d'un membre")
            .setThumbnail(`${client.user.avatarURL()}`)
            .setAuthor({ name: `Rendu muet par ${interaction.member.displayName}`, iconURL: `${interaction.member.displayAvatarURL()}` })
            .addField("Membre rendu muet", `<@${member.id}>`, false)
            .addField("Raison", `${muteReason}`, false)
            .setColor('#ff0000')
            .setTimestamp()

        try {
            member.roles.add(eval('config.guild_' + message.guild.id + '.roles[\'Mute\']'))
            interaction.reply({ embeds: [muteEmbed] })
        } catch (err) {
            interaction.reply(`Oops!\nIl semblerait que je ne puisse pas rendre muette cette personne..\n\n*Causes probables :* \n\`Cette personne a la permission 'ADMINSTRATEUR'\`.\n\`Cette personne est plus élevée que moi dans la liste des membres\`.`)
        }
    },
}
