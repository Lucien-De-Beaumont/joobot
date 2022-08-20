const Discord = require("discord.js");
const config = require("../config");
const Logger = require("../utils/Logger");

module.exports = {
    name: "say",
    description: "Se mettre dans la peau d'Izu",
    hidden: false,
    options: [{
        name: "channel",
        description: "Dans quel salon suis-je censé parler ?",
        required: true,
        type: "CHANNEL"
    }, {
        name: "texte",
        description: "Que dois-je dire ?",
        required: true,
        type: "STRING"
    }, {
        name: "idmessage",
        description: "Quel est l'ID du message auquel répondre ?",
        required: false,
        type: "STRING"
    }],
    helpType: "fun",

    runInteraction(client, interaction) {

        let channel = interaction.options.getChannel("channel")
        let text = interaction.options.getString("texte")
        let snowflake = interaction.options.getString("idmessage")

        try { eval('config.guild_' + interaction.guild.id + ".perms['wholeStaff']") } catch (err) { return Logger.debug('fatal error occured:' + err)}

        if (!interaction.member.roles.cache.some(r => eval('config.guild_' + interaction.guild.id + ".perms['wholeStaff']").includes(r.id))) { return interaction.reply({ content: `Vous n'avez pas les permissions nécessaires !`, ephemeral: true }) }
        interaction.reply('Message envoyé !').then(interaction.deleteReply())
        if (snowflake === null) {
            try { client.channels.cache.get(channel.id).send(text) } catch (err) { console.log(err) }
        } else {
            try { client.channels.cache.get(channel.id).messages.fetch(snowflake).then(message => message.reply(text)) } catch (err) { console.log(err) }
        }
    },
}
